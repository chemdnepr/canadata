import { intArg } from "nexus";
import { stringArg } from "nexus";
import { extendType, objectType, nonNull } from "nexus";
import { result } from "nexus/dist/utils";
import { resolve } from "path";

export const Lmia = objectType({
  name: 'Lmia',
  definition(t) {
    t.string('id');
    t.string('province');
    t.string('stream');
    t.string('employer');
    t.string('address');
    t.string('occupation');
    t.string('noc');
    t.string('incorporate_status');
    t.string('approved_lmias');
    t.string('approved_positions');
    t.string('year');
    t.string('quarter');
    t.string('logo');
    t.string('url');
  }
});

export const PageInfoLmia = objectType({
  name: 'PageInfoLmia',
  definition(t) {
    t.string('endCursor');
    t.int('count');
    t.boolean('hasNextPage');
  }
});

export const ResponseLmia = objectType({
  name: 'ResponseLmia',
  definition(t) {
    t.field('pageInfoLmia', { type: PageInfoLmia});
    t.list.field('edges', { type: EdgeLmia });
  }
});

export const EdgeLmia = objectType({
  name: 'EdgeLmia',
  definition(t) {
    t.string('cursor');
    t.field('node', {
      type: Lmia
    });
  }
});

export const LmiasQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('lmias', {
      type: ResponseLmia,
      args: {
        first: intArg(),
        after: stringArg(),
        noc: stringArg(),
        province: stringArg(),
        city: stringArg(),
        company: stringArg(),
        year: stringArg()
      },
      async resolve(_, args, ctx) {
        let queryResults = null;   
        const y = parseInt('' + args.year);
        const year = !isNaN(y) ? y : undefined;
        const count = await ctx.prisma.lmia.count({
          where: {
            noc: {
              startsWith: args.noc
            },
            province: {
              contains: args.province
            },
            address: {
              contains: args.city
            },
            employer: {
              contains: args.company
            },
            year
          }
        });
        if (args.after) {
          queryResults = await ctx.prisma.lmia.findMany({
            where: {
              noc: {
                startsWith: args.noc
              },
              province: {
                contains: args.province
              },
              address: {
                contains: args.city
              },
              employer: {
                contains: args.company
              },
              year
            },
            take: args.first,
            skip: 1,
            cursor: {
              id: args.after
            }
          })
        } else {
          queryResults = await ctx.prisma.lmia.findMany({
            where: {
              noc: {
                startsWith: args.noc
              },
              province: {
                contains: args.province
              },
              address: {
                contains: args.city
              },
              employer: {
                contains: args.company
              },
              year
            },
            take: args.first
          });
        }
        if (queryResults.length > 0 ) {
          const lastLinkInResults = queryResults[queryResults.length - 1];
          const myCursor = lastLinkInResults.id;
          const secondQueryResults = await ctx.prisma.lmia.findMany({
            where: {
              noc: {
                startsWith: args.noc
              },
              province: {
                contains: args.province
              },
              address: {
                contains: args.city
              },
              employer: {
                contains: args.company
              },
              year
            },
            take: args.first,
            cursor: {
              id: myCursor
            }
          });

          const result = {
            pageInfoLmia: {
              endCursor: myCursor,
              count,
              hasNextPage: secondQueryResults.length > 1  
            },
            edges: queryResults.map(lmia => ({
              cursor: lmia.id,
              node: lmia
            }))
          };
          return result;
        }
        return {
          edges: [],
          pageInfoLmia: {
            endCursor: '',
            count,
            hasNextPage: false
          } 
        }
      }
    })
  }
})

export const getLmiaById = extendType({
  type: 'Query',
  definition(t) {
    t.field('lmia', {
      type: Lmia,
      args: {
        lmiaId: nonNull(stringArg())
      },
      async resolve(_, args, ctx) {
        const result = await ctx.prisma.lmia.findUnique({
          where: {
            id: args.lmiaId
          }
        })
        return result; 
      }
    })
  }
});
export const CreateLmiaMutation = extendType({
  type: 'Mutation',
  definition(t) {
    t.nonNull.field('updateLmia', {
      type: Lmia,
      args: {
        id: nonNull(stringArg()),
        logo: stringArg(),
        url: stringArg()        
      },
      async resolve(_parent, args, ctx) {
        if (!ctx.user) {
          throw new Error(`You need to be logged in to perform an action`)
        }

        const user = await ctx.prisma.user.findUnique({
          where: {
            email: ctx.user.email,
          },
        });

         if (user.role !== 'ADMIN') {
          throw new Error(`You do not have permission to perform action`);
        }

        const newLmia = {
          id: args.id,
          logo: args.logo,
          url: args.url
        };

        return await ctx.prisma.lmia.update({         
          data: newLmia,
          where: {
            id: args.id
          },
        });
      },
    });
  },
});