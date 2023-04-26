import type { NextPage } from 'next';
import Head from 'next/head';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useState } from 'react';
import Footer from '../components/Layout/Footer';

const LmiaPositiveChart = dynamic(() => import('../components/charts/LmiaPositiveChart'), { ssr: false });
const LmiaProvincesPieChart = dynamic(() => import('../components/charts/LmiaProvincesPieChart'), { ssr: false });
import { gql, useQuery } from '@apollo/client';


const AllLinksQuery = gql`
  query allLinksQuery($first: Int, $after: String) {
    links(first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      edges {
        cursor
        node {
          imageUrl
          url
          title
          category
          description
          id
        }
      }
    }
  }
`;

const Home: NextPage = () => {
  const { data, error, loading, fetchMore } = useQuery(AllLinksQuery, {
    fetchPolicy: "network-only",
    variables: {
      first: 2,
    }
  });

  const saveLastRoute = (link: string = '') => {
    if (typeof window !== "undefined") {
      const route = link ? link : window.location.href;
      localStorage.setItem('last-successful-route', route);
    }    
  };

  const [isLmiaShowMore, setIsLmiaShowMore] = useState(false);
  if (loading) return <p>Loading......</p>

  if (error) return <p>Oops, {error.message}</p>

  const { endCursor, hasNextPage } = data.links.pageInfo;

  return (
    <div>
      <Head>
        <title>canadata.info</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto max-w-100">
        <h1 className="text-center font-medium text-4xl pb-2">LMIA</h1>
        <h2 className="text-center font-medium text-xl">Why do you need it?</h2>
        <div className="indent-10 text-lg pl-20 pr-20 pt-10">
          In regular flow the only way how foreigner can enter and work in Canada is to get Work Permit or Study Permit.
          In order to get Work Permit one should:
          <ol className="list-decimal ml-16">
            <li className="indent-1">Find employer in Canada who is able to pass procedure of obtaining an LMIA</li>
            <li className="indent-1">Send CV</li>
            <li className="indent-1">Pass interviews</li>
            <li className="indent-1">Get an Offer</li>
          </ol>

        </div>
        <p className="indent-10 text-lg pl-20 pr-20 pb-10">
          So, what is it LMIA? {!isLmiaShowMore && <span className="text-blue-500 cursor-pointer text-sm" onClick={() => setIsLmiaShowMore(true)}>Read more...</span>}
        </p>
        {isLmiaShowMore &&
          <>
            <p className="indent-10 text-lg pl-20 pr-20 pt-1">
              LMIA - labour market impact assessment - is a document that companies should obtain to hire foreign workers.
              An LMIA is a form of labour market verification designed to protect Canada's domestic employees. In simple words,
              Canada's government want to check that employees in Canada will be hired first, and only if there is no proper candidates for
              a specific job, forein workers are considered.
              Not every employer can do that. There are requirments for companies who can get LMIA to support permanent residence.
              For example the company should be in business for at least 1 year etc.
            </p>
            <p className="indent-10 text-lg pl-20 pr-20 pt-1">
              When employer gets LMIA you will receive Closed Work Permit that will allow to work only for this employer
              until you get Permanen Residence (PR).
            </p>
            <div className="flex flex-col items-center justify-center">
              <h2 className="font-medium text-lg m-5">Immigration Path through JOB Offer from Canadian Company</h2>
              <img className="p-10" src="/pr_diagram.svg" />
            </div>
            <p className="indent-10 text-lg pl-20 pr-20 pt-1 pb-10">
              In some cases, foreiners can get Open Work Permit, that allows to work on any employer in Canada without restrictions.
              It sounds more attractive than Closed Work Permit, but in this case you won't get extra 50(200) points in your Express Entry profile.
              Also LMIA is a must for some Provincial Nominee Programs.
            </p>
          </>
        }
        <ul className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 pb-40 pl-10 pr-10 custom-violet ">
          <li className="max-w-md  rounded">
            <div className="p-5 flex space-y-2 h-96 w-96">
              <LmiaPositiveChart />
            </div>
          </li>
          <li>
            <div className="flex margin-84 indent-5 text-lg">
              <p>The graphic description of a positive LMIA that were issued by Service Canada.
                A positive LMIA must be obtained by an employer before hiring a Temporary Foreign Worker for a specific occupation.
                By this graphic you can gain information about amount of issued LMIAs for specific NOC (National Occupational Classification) and Province.
                Above the graphic there are filters by Province and NOC.
              </p>
            </div>
          </li>
        </ul>
        <Link href="/">
          <div className="flex flex-col pb-10 pl-10 pr-10 justify-center items-center cursor-pointer canada-background">
            <h2 className="text-center mt-10 font-medium text-5xl">How to find proper company to get an offer with LMIA</h2>
            <Link href="/lmia">
              <div onClick={() => saveLastRoute('/lmia')} className="w-64 m-auto h-12 flex items-center border-slate-400 justify-center border-2 hover:font-medium text-3xl cursor-pointer rounded">Find Employer</div>
            </Link>
          </div>
        </Link>

        <ul className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 gap-5 custom-blue p-10">
          <li className="max-w-md ml-10 mt-12">
            <div className="flex">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/9/92/Political_map_of_Canada.svg/1104px-Political_map_of_Canada.svg.png" />
            </div>
          </li>
          <li>
            <div className="flex flex-col space-y-2 h-112">
              <LmiaProvincesPieChart />
            </div>
          </li>
        </ul>
      </div>
      <Footer />
    </div >
  )
}

export default Home
