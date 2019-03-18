'use strict';

var _interopRequireDefault = require('@babel/runtime/helpers/interopRequireDefault');

var _asyncToGenerator2 = _interopRequireDefault(
  require('@babel/runtime/helpers/asyncToGenerator')
);

const cloudinary = require('cloudinary');

exports.sourceNodes =
  /*#__PURE__*/
  (function() {
    var _ref = (0, _asyncToGenerator2.default)(function*(
      { actions, createNodeId, createContentDigest },
      configOptions
    ) {
      const createNode = actions.createNode;
      const folders = configOptions.folders;
      const queryParams = {
        tags: true,
        type: 'upload',
        max_results: `24`,
        resource_type: 'image'
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
        }/image/upload/w_600/v${image.version}/${image.public_id}.${
          image.format
        }`;
        const imgUrl =
          orientation === 'portrait'
            ? `https://res.cloudinary.com/${
                configOptions.cloudName
              }/image/upload/h_1200/v${image.version}/${image.public_id}.${
                image.format
              }`
            : `http://res.cloudinary.com/${
                configOptions.cloudName
              }/image/upload/w_1200/v${image.version}/${image.public_id}.${
                image.format
              }`;
        const imageData = Object.assign(
          {
            folder,
            imgUrl,
            thumb,
            orientation
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

      for (
        var _iterator = folders,
          _isArray = Array.isArray(_iterator),
          _i = 0,
          _iterator = _isArray ? _iterator : _iterator[Symbol.iterator]();
        ;

      ) {
        var _ref2;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref2 = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref2 = _i.value;
        }

        const folderName = _ref2;
        queryParams.prefix = folderName;
        const folderMediaItems = yield cloudinary.v2.api.resources(
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
    });

    return function(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  })();
