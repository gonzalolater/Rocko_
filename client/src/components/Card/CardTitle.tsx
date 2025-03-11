import React from 'react';

type Props = {
  title?: string;
};

function CardTitle(props: Props) {
  const { title } = props;
  if (!title) return null;
  return <p className="m-0 text-lg leading-6 font-medium">{title}</p>;
}

export default CardTitle;
