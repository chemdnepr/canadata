// components/Layout/Header.tsx
import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';


const Header = () => {
  const { user } = useUser();
  const router = useRouter();
  const { locale, locales, defaultLocale } = router;
  const saveLastRoute = (link: string = '') => {
    if (typeof window !== "undefined") {
      const route = link ? link : window.location.href;
      localStorage.setItem('last-successful-route', route);
    }
  };
  return (
    <header className="text-gray-600 body-font pb-10 bg-yellow-50">
      <div className="container mx-auto flex flex-wrap pt-5 pl-5 pr-5 flex-col md:flex-row items-start">
        <Link href="/">
          <div className="flex flex-col cursor-pointer ml-10">
            <img src="/logo.png" width="150" />
            <div className="justify-center font-bold flex flex-row logo-text"><div className="mr-2 cana">cana</div><div className="ml-1 data">data</div></div>
          </div>
        </Link>
        <div className="text-xl m-auto text-center">
          <div className="mb-10 flex justify-center mt-2">
            <Script src="https://apis.google.com/js/platform.js" />
            <div className="g-ytsubscribe" data-channelid="UC0TcNvE4ZrOR6QtxwRRxgpg" data-layout="default" data-count="default"></div>
            <div className="ml-4 border patreon-btn">
              <img src="/patreon.png" />
            </div>
          </div>
          <div className="canadata-main-sign mb-5">CANADATA</div>
          <div className="font-dirty mb-4">
            Foreign worker <span className="font-sans">-</span> Do not wait! &nbsp;
            Find new job to immigrate!
          </div>
          <Link href="/lmia">
            <div onClick={() => saveLastRoute('/lmia')} className="w-44 m-auto h-10 flex items-center justify-center border-2 hover:font-medium text-lg cursor-pointer rounded">Employers</div>
          </Link>
        </div>
        <nav className="md:ml-auto flex flex-wrap items-start text-base justify-center">
          {user ? (
            <div className="flex items-center space-x-5">
              <Link href="/api/auth/logout">
                <a className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                  Logout
                </a>
              </Link>
              <img alt="profile" className="rounded-full w-12 h-12" src={user.picture} />
            </div>
          ) : (
            <>
              {locale === 'en' ?
                <Link href="/" locale="ua">ua</Link>
                :
                <Link href="/" locale="en">en</Link>
              }
              <Link href="/api/auth/login">
                <a onClick={saveLastRoute} className="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">
                  Login
                </a>
              </Link>

            </>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header;

if (typeof window !== "undefined") {
  const route = localStorage.getItem('last-successful-route');
  if (route) {
    window.location.href = route;
    localStorage.removeItem('last-successful-route');
  }
}

