
import React from 'react';
import { useParams } from 'react-router-dom';
import CreateBlogForm from './createBlog.jsx';
const EditBlogPage = () => {
  const { id } = useParams();

  return <CreateBlogForm blogId={id} />;
};

export default EditBlogPage;
