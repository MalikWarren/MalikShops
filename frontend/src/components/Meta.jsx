import React from 'react';
import {Helmet} from 'react-helmet-async';

const Meta = ({title, description, keywords}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta
        name='description'
        content={description}
      />
      <meta
        name='keywords'
        content={keywords}
      />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: 'Welcome To MalikShop',
  description: 'We sell the best products for cheap',
  keywords: 'electronics, buy electronics, cheap electroincs',
};

export default Meta;
