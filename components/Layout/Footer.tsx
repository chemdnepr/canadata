// components/Layout/Header.tsx
import React from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useRouter } from 'next/router';
import { useUser } from '@auth0/nextjs-auth0';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faYoutube, faPatreon } from "@fortawesome/free-brands-svg-icons";
const Footer = () => {
  const { user } = useUser();
  const router = useRouter();
  return (
    <div className="text-gray-600 body-font bg-slate-800 h-24 flex flex-col items-center justify-center">
      <div className="social-buttons flex w-full space-x-10 items-center text-right justify-end mr-20">
        <Link href="#">
          <FontAwesomeIcon
            icon={faYoutube}
            style={{ fontSize: 25, color: "white" }}
            className="cursor-pointer"
          />
        </Link>
        <Link  href="#">
          <FontAwesomeIcon
            icon={faPatreon}
            style={{ fontSize: 25, color: "white" }}
            className="cursor-pointer"
          />
        </Link>
      </div>
      <div className="">©&nbsp;2022&nbsp;canadata.info</div>
    </div>)
}

export default Footer