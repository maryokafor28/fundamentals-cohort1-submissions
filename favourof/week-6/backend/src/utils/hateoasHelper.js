export const addHATEOASLinks = (resource, basePath) => {
  console.log(resource);

  return {
    ...resource,
    links: [
      { rel: "self", method: "GET", href: `${basePath}/${resource.id}` },
      { rel: "update", method: "PATCH", href: `${basePath}/${resource.id}` },
      { rel: "delete", method: "DELETE", href: `${basePath}/${resource.id}` },
    ],
  };
};
