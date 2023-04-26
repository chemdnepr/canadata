// pages/admin.tsx
import React from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/router'
import { gql, useMutation, useQuery } from '@apollo/client'
import toast, { Toaster } from 'react-hot-toast'
import { getSession } from '@auth0/nextjs-auth0'
import prisma from '../../lib/prisma'

const GetLmiaById = gql`
  query getLmiaById($lmiaId: String!){
    lmia(lmiaId: $lmiaId) {
      id
      province
      stream
      employer
      address
      occupation
      noc
      incorporate_status
      approved_lmias
      approved_positions
      year
      quarter
      logo
      url
    }
  }
`
const UpdateLmiaMutation = gql`
  mutation($id: String!, $logo: String!, $url: String!) {
    updateLmia(id: $id, logo: $logo, url: $url) {
      id
      logo
      url
    }
  }
`

const PostLmia = () => {
  const router = useRouter();
  const { lmiaId } = router.query;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm()
  
  const lmiaResponse = useQuery(GetLmiaById, {
    fetchPolicy: "network-only",
    variables: {
      lmiaId
    }
  });
  const lmia = lmiaResponse?.data?.lmia;
  
  const [createLmia, { loading, error }] = useMutation(UpdateLmiaMutation, {
    onCompleted: () => reset()
  })

  const onSubmit = async data => {
       
    const variables = { id: lmiaId, logo: data.logo, url: data.url }
    try {
      toast.promise(createLmia({ variables }), {
        loading: 'Updating Lmia..',
        success: 'LMIA successfully updated!🎉',
        error: `Something went wrong 😥 Please try again -  ${error}`,
      })

    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div className="container mx-auto max-w-md py-12">
      <Toaster />
      <h1 className="text-3xl font-medium my-5">Edit LMIA Record</h1>
      <div className="shadow  max-w-md  rounded">
        <div className="flex justify-between text-center text-sm text-white bg-gray-700 rounded rounded-b-none">
          <div className="ml-4">{lmia?.province}</div>
          <div className="mr-4">{lmia?.year}</div>          
        </div>
        <div className="img-box">
          {lmia?.logo ?
            <img src={lmia.logo} />
            :
            <div>Company Logo</div>
          }
        </div>
        <div className="p-5 flex flex-col space-y-2">
          <p className="text-lg font-medium text-grey-600">{lmia?.employer}</ p>
          <p className="text-sm text-blue-500">{lmia?.address}</p>
          <p className="text-sm">{lmia?.occupation}</p>
          {lmia?.url &&
            <div className="text-sm text-blue-500">
              <a href={lmia.url}>{lmia.url}</a>
            </div>
          }
        </div>
      </div>
      <form className="grid grid-cols-1 gap-y-6 shadow-lg p-8 rounded-lg" onSubmit={handleSubmit(onSubmit)}>
        <label className="block">
          <span className="text-gray-700">Logo</span>
          <input
            placeholder="Logo"
            name="logo"
            defaultValue={lmia?.logo}
            type="text"            
            {...register('logo', { required: true })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <label className="block">
          <span className="text-gray-700">Url</span>
          <input
            placeholder="https://example.com"
            defaultValue={lmia?.url}
            {...register('url', { required: true })}
            name="url"
            type="text"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </label>
        <button
          disabled={loading}
          type="submit"
          className="my-4 capitalize bg-blue-500 text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="w-6 h-6 animate-spin mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M11 17a1 1 0 001.447.894l4-2A1 1 0 0017 15V9.236a1 1 0 00-1.447-.894l-4 2a1 1 0 00-.553.894V17zM15.211 6.276a1 1 0 000-1.788l-4.764-2.382a1 1 0 00-.894 0L4.789 4.488a1 1 0 000 1.788l4.764 2.382a1 1 0 00.894 0l4.764-2.382zM4.447 8.342A1 1 0 003 9.236V15a1 1 0 00.553.894l4 2A1 1 0 009 17v-5.764a1 1 0 00-.553-.894l-4-2z" />
              </svg>
              Updating...
            </span>
          ) : (
            <span>Update Lmia</span>
          )}
        </button>
      </form>
    </div>
  )
}

export default PostLmia

export const getServerSideProps = async ({ req, res }) => {
  const session = getSession(req, res);

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: '/api/auth/login',
      },
      props: {},
    };
  }

  const user = await prisma.user.findUnique({
    select: {
      email: true,
      role: true,
    },
    where: {
      email: session.user.email,
    },
  });

  if (user.role !== 'ADMIN') {
    return {
      redirect: {
        permanent: false,
        destination: '/404',
      },
      props: {},
    };
  }

  return {
    props: {},
  };
};