import type { NextPage } from 'next';
import Head from 'next/head';
import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { getSession } from '@auth0/nextjs-auth0'

import { useUser } from '@auth0/nextjs-auth0';

const AllLmiasQuery = gql`
  query allLmiasQuery($first: Int, $after: String, $noc: String, $province: String, $city: String, $company: String, $year: String) {
    lmias(first: $first, after: $after, noc: $noc, province: $province, city: $city, company: $company, year: $year) {
      pageInfoLmia {
        endCursor
        hasNextPage
        count
      }
      edges {
        cursor
        node {
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
    }
  }
`;

const Lmia: NextPage = () => {
  const { user } = useUser();
  const [noc, setNoc] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [company, setCompany] = useState('');
  const [year, setYear] = useState('');
  const [isChanged, setIsChanged] = useState(false);
  
  const roles = (user ? user['https://canadata.io/roles'] : '') as String[];
  const role = roles?.length ? roles[0] : '';
  const getVariables = () => (
    {
      after: '',
      noc: noc.length ? noc : '',
      province: province.length ? province : '',
      city: city.length ? city : '',
      company: company.length ? company : '',
      year: year.length ? year : '',
      first: 9,
    }
  );

  const [variables, setVariables] = useState(getVariables());

  let { data, error, loading, fetchMore } = useQuery(AllLmiasQuery, {
    fetchPolicy: "network-only",
    variables
  });

  if (loading) return <p>Loading......</p>

  if (error) return <p>Oops, {error.message}</p>

  const { endCursor, hasNextPage, count } = data.lmias.pageInfoLmia;

  const search = () => {
    setIsChanged(false);
    setVariables({
      after: '',
      noc: noc.length ? noc : '',
      province: province.length ? province : '',
      city: city.length ? city : '',
      company: company.length ? company : '',
      year: year.length ? year : '',
      first: 9,
    })
  };

  const handleProvince = (e) => {
    const value = e.target.value;
    setProvince(value);
    setIsChanged(true);
  }

  const handleNoc = (e) => {
    const value = e.target.value;
    setNoc(value);
    setIsChanged(true);
  }

  const handleCity = (e) => {
    const value = e.target.value;
    setCity(value);
    setIsChanged(true);
  }

  const handleCompany = (e) => {
    const value = e.target.value;
    setCompany(value);
    setIsChanged(true);
  }

  const handleYear = (e) => {
    const value = e.target.value;
    setYear(value);
    setIsChanged(true);
  }

  const editLmiaRecord = (node) => {
    const id = node.id;
    window.location.href = `/post/${id}`;
  }


  return (
    <div>
      <Head>
        <title>LMIA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container mx-auto max-w-5xl">
        <div className="flex flex-row mb-4 font-medium">{data.lmias.edges.length} of {count}</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
          <div className="flex flex-col">
            <label>NOC</label>
            <input className="rounded" type="text" value={noc} onChange={handleNoc} />
          </div>
          <div className="flex flex-col">
            <label>Province</label>
            <input className="rounded" type="text" value={province} onChange={handleProvince} />
          </div>
          <div className="flex flex-col">
            <label>City</label>
            <input className="rounded" type="text" value={city} onChange={handleCity} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mb-4">
          <div className="flex flex-col">
            <label>Company</label>
            <input className="rounded" type="text" value={company} onChange={handleCompany} />
          </div>
          <div className="flex flex-col">
            <label>Year</label>
            <select onChange={handleYear} className="rounded">
              <option value="all">All</option>
              {['2022', '2021', '2020', '2019', '2018', '2017', '2016'].map((y) => (
                year === y ? <option key={y} value={y} selected>{y}</option> : <option key={y} value={y}>{y}</option>))}
            </select>
          </div>
          <div className="flex flex-col">
            <label></label>
            <button disabled={!isChanged} className="text-white search-btn mt-5 h-12 disabled:opacity-50 rounded" onClick={search}>Search</button>
          </div>
        </div>
        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.lmias.edges.map(({ node }) => (
            <li key={node.id} className="shadow shadow-slate-600 max-w-md rounded">
              <div className="flex justify-between text-center text-sm text-white bg-gray-700 pt-2 pb-2 rounded rounded-b-none">
                <div className="ml-4">{node.province}</div>
                <div className="mr-4">{node.year}</div>
                {role === 'admin' && <div className="mr-4 cursor-pointer" onClick={() => editLmiaRecord(node)}>⚙</div>}
              </div>
              <div className="img-box">
                {node.logo ?
                  <img className="logo-size" src={node.logo} />
                  :
                  <div>Company Logo</div>
                }
              </div>
              <div className="p-5 flex flex-col space-y-2">
                <p className="text-lg font-medium text-grey-600">{node.employer}</ p>
                <p className="text-sm orange">{node.address}</p>
                <p className="text-sm">{node.occupation}</p>
                {node.url &&
                  <div className="text-sm text-blue-500">
                    <a target="_blank" href={node.url} className="flex hover:text-blue-500">
                      {node.url}
                      <svg
                        className="w-4 h-4 my-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                        <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                      </svg>
                    </a>
                  </div>
                }
              </div>
            </li>
          ))}
        </ul>
        {hasNextPage ? (
          <button className="px-4 py-2 bg-value-500 rounded my-10 font-medium hover:text-blue-600"
            onClick={() => {
              fetchMore({
                variables: { after: endCursor },
                updateQuery: (prevResult, { fetchMoreResult }) => {
                  fetchMoreResult.lmias.edges = [
                    ...data.lmias.edges,
                    ...fetchMoreResult.lmias.edges
                  ];
                  return fetchMoreResult;
                }
              })
            }}>More</button>
        ) : (<div></div>)}
      </div>

    </div>
  )
}

export default Lmia;

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
