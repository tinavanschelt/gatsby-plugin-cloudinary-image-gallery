const cloudinary = require('cloudinary');

exports.sourceNodes = async (
  { actions, createNodeId, createContentDigest },
  configOptions
) => {
  const { createNode } = actions;
  const { folders } = configOptions;
  const queryParams = {
    tags: true,
    type: 'upload',
    max_results: `24`,
    resource_type: 'image',
    context: true,
  };

  delete configOptions.plugins;

  cloudinary.config({
    cloud_name: configOptions.cloudName,
    api_key: configOptions.apiKey,
    api_secret: configOptions.apiSecret
  });

  const getImageOrientation = (width, height) => {
    if (height === width) {
      return 'square';
    } else if (height > width) {
      return 'portrait';
    } else {
      return 'landscape';
    }
  };

  const processMediaItem = (image, folder) => {
    const nodeId = createNodeId(`cloudinary-image-${image.public_id}`);
    const orientation = getImageOrientation(image.width, image.height);
    const thumb = `https://res.cloudinary.com/${
      configOptions.cloudName
    }/image/upload/w_600/v${image.version}/${image.public_id}.${image.format}`;
    const imgUrl =
      orientation === 'portrait'
        ? `https://res.cloudinary.com/${
            configOptions.cloudName
          }/image/upload/h_1200/v${image.version}/${image.public_id}.${
            image.format
          }`
        : `https://res.cloudinary.com/${
            configOptions.cloudName
          }/image/upload/w_1200/v${image.version}/${image.public_id}.${
            image.format
          }`;
    const imageData = Object.assign(
      { folder,
        imgUrl,
        thumb,
        orientation,
        context: {
          custom: {
            alt: '',
            caption: ''
          }
        },
      },
      image
    );

    const nodeContent = JSON.stringify(imageData);

    const nodeData = Object.assign({}, imageData, {
      id: nodeId,
      parent: null,
      children: [],
      internal: {
        type: `CloudinaryImage`,
        content: nodeContent,
        contentDigest: createContentDigest(imageData)
      }
    });

    return nodeData;
  };

  for (const folderName of folders) {
    queryParams.prefix = folderName;

    const folderMediaItems = await cloudinary.v2.api.resources(
      queryParams,
      (error, result) => result
    );

    if (folderMediaItems.resources.length > 0) {
      folderMediaItems.resources.forEach(mediaItem => {
        const nodeData = processMediaItem(mediaItem, folderName);
        createNode(nodeData);
      });
    } else {
      console.log(
        `\n No cloudinary files where found in the folder ${folderName}, please check your node-config`
      );
    }
  }
};
