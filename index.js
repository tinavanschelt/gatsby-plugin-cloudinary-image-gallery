"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

exports.__esModule = true;
exports.default = void 0;

var _react = _interopRequireWildcard(require("react"));

var _propTypes = _interopRequireDefault(require("prop-types"));

var _styledComponents = _interopRequireDefault(require("styled-components"));

var _photoswipe = _interopRequireDefault(require("photoswipe"));

var _photoswipeUiDefault = _interopRequireDefault(require("photoSwipe/dist/photoswipe-ui-default"));

require("photoSwipe/dist/default-skin/default-skin.css");

require("photoSwipe/dist/photoswipe.css");

var _PhotoSwipeDOM = _interopRequireDefault(require("./PhotoSwipeDOM"));

var _jsxFileName = "/Users/tina/repos/gatsby/gatsby-google-photos-gallery-example/plugins/gatsby-cloudinary-image-gallery/src/index.js";

const getImageSize = (width, height, orientation) => {
  if (orientation === "square") {
    return {
      width: 1200,
      height: 1200
    };
  } else if (orientation === "portrait") {
    // portrait
    const ratio = height / width;
    return {
      width: 1200,
      height: parseInt(ratio * 1200, 10)
    };
  } else {
    // landscape
    const ratio = width / height;
    return {
      width: parseInt(ratio * 1200, 10),
      height: 1200
    };
  }
};

const imgContainerPadding = orientation => {
  if (orientation === "square") {
    // square
    return "100%";
  } else if (orientation === "portrait") {
    // portrait
    return "130%";
  } else {
    // landscape
    return "70%";
  }
};

const openPhotoSwipe = (items, index) => {
  const pswpElement = document.querySelectorAll(".pswp")[0];
  var options = {
    index,
    showAnimationDuration: 0,
    hideAnimationDuration: 0
  };
  var gallery = new _photoswipe.default(pswpElement, _photoswipeUiDefault.default, items, options);
  gallery.init();
};

const renderImageGridItem = (img, galleryItems, orientation, index) => {
  const imgOrientation = orientation ? orientation : img.node.orientation;
  const imgSize = getImageSize(img.node.width, img.node.height, img.node.orientation);
  const containerPadding = imgContainerPadding(imgOrientation);
  return _react.default.createElement(ImageGridItem, {
    onClick: () => openPhotoSwipe(galleryItems, index),
    "data-size": `${imgSize.width}x${imgSize.height}`,
    key: img.node.publicId,
    thumb: `${img.node.thumb}`,
    imgUrl: `${img.node.imgUrl}`,
    orientation: imgOrientation,
    padding: containerPadding,
    itemProp: "contentUrl",
    __source: {
      fileName: _jsxFileName,
      lineNumber: 70
    },
    __self: void 0
  });
};

const renderRows = (columns, images, galleryItems, orientation) => {
  let counter = 0;
  return columns.map((row, index) => {
    if (index !== 0) {
      counter = counter + columns[index - 1];
    }

    const rowImages = images.slice(counter, counter + row);
    return _react.default.createElement(ImageGridRow, {
      columns: row,
      key: counter,
      imgCount: row,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 94
      },
      __self: void 0
    }, rowImages.map(img => {
      const index = galleryItems.findIndex(item => item.filename === img.node.filename);
      return renderImageGridItem(img, galleryItems, orientation, index);
    }));
  });
};

const getListOfGalleryItems = (images, imagesVisibleCount) => {
  let items = images.map(image => {
    return {
      publicId: image.node.public_id,
      src: `${image.node.imgUrl}`,
      w: image.node.width,
      h: image.node.height
    };
  });

  if (imagesVisibleCount && items.length > imagesVisibleCount) {
    items = items.slice(0, imagesVisibleCount);
  }

  return items;
};

const isOdd = num => num % 2;

class ImageGrid extends _react.Component {
  componentDidMount() {
    window.PhotoSwipe = _photoswipe.default;
    window.PhotoSwipeUI_Default = _photoswipeUiDefault.default;
  }

  render() {
    const {
      folder,
      columns,
      data,
      orientation
    } = this.props;
    let imageGridColumns = 2;
    let columnsPerRow;
    let galleryItems;
    const images = data.cloudinaryImage.edges.filter(image => image.node.folder === folder);

    if (isOdd(images.length) === 1) {
      imageGridColumns = 3;
    }

    if (columns && columns.length > 0) {
      columnsPerRow = columns.split(",").map(Number);
      const imagesVisibleCount = columnsPerRow.reduce((partialSum, a) => partialSum + a);
      galleryItems = getListOfGalleryItems(images, imagesVisibleCount);
    } else {
      galleryItems = getListOfGalleryItems(images);
    }

    return _react.default.createElement(_react.Fragment, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 156
      },
      __self: this
    }, _react.default.createElement(ImageGridWrapper, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 157
      },
      __self: this
    }, columns && columns.length > 0 ? _react.default.createElement(_react.Fragment, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 159
      },
      __self: this
    }, renderRows(columnsPerRow, images, galleryItems, orientation)) : _react.default.createElement(ImageGridRow, {
      columns: imageGridColumns,
      __source: {
        fileName: _jsxFileName,
        lineNumber: 163
      },
      __self: this
    }, images.map((img, index) => renderImageGridItem(img, galleryItems, orientation, index)))), _react.default.createElement(_PhotoSwipeDOM.default, {
      __source: {
        fileName: _jsxFileName,
        lineNumber: 170
      },
      __self: this
    }));
  }

}

const ImageGridWrapper = _styledComponents.default.div`
  display: block;
`;
const ImageGridRow = _styledComponents.default.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: ${props => `repeat(${props.columns}, 1fr)`};
  margin-bottom: 1em;
`;
const ImageGridItem = _styledComponents.default.a`
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  background-image: ${props => `url(${props.thumb})`};
  box-shadow: none;
  padding-bottom: ${props => props.padding};
  display: inline-block;
  width: 100%;
`;
ImageGrid.propTypes = {
  folder: _propTypes.default.string.isRequired
};
var _default = ImageGrid;
exports.default = _default;