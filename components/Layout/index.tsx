import React from "react";
import Header from "./Header";
import Link from 'next/link';
import { AwesomeLink } from '../components/AwesomeLink';

const Layout = ({ children }) => {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
};

export default Layout;