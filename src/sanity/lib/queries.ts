import { groq } from 'next-sanity';

const postData = `{
  title,
  slug,
  categories,
  author->{
    _id,
    name,
    slug,
    image,
    bio
  },
  mainImage,
  publishedAt,
  body,
  preview
}`;

export const postQuery = groq`*[_type == 'post'] ${postData}`;

export const postQueryBySlug = groq`*[_type == "post" && slug.current == $slug][0] ${postData}`;

export const postQueryByCategory = groq`*[_type == "post" && $slug in categories[]->slug.current] ${postData}`;

export const postQueryByAuthor = groq`*[_type == "post" && author->slug.current == $slug] ${postData}`;
