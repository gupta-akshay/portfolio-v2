import { groq } from 'next-sanity';

const postData = `{
  _id,
  title,
  slug,
  categories[]->{
    title,
    slug
  },
  author->{
    _id,
    name,
    slug,
    image,
    bio
  },
  mainImage,
  publishedAt,
  body
}`;

export const postQuery = groq`*[_type == 'post'] ${postData}`;

export const postQueryBySlug = groq`*[_type == "post" && slug.current == $slug][0] ${postData}`;

export const postQueryByCategory = groq`*[_type == "post" && $slug in categories[]->slug.current] ${postData}`;

export const postQueryByAuthor = groq`*[_type == "post" && author->slug.current == $slug] ${postData}`;
