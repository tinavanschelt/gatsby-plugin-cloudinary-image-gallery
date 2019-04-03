import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

import PhotoSwipe from 'photoswipe';
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default';
import 'photoswipe/dist/default-skin/default-skin.css';
import 'photoswipe/dist/photoswipe.css';

import PhotoSwipeDOM from './PhotoSwipeDOM';

const getImageSize = (width, height, orientation) => {
  if (orientation === 'square') {
    return { width: 1200, height: 1200 };
  } else if (orientation === 'portrait') {
    // portrait
    const ratio = height / width;
    return { width: 1200, height: parseInt(ratio * 1200, 10) };
  } else {
    // landscape
    const ratio = width / height;
    return { width: parseInt(ratio * 1200, 10), height: 1200 };
  }
};

const imgContainerPadding = orientation => {
  if (orientation === 'square') {
    // square
    return '100%';
  } else if (orientation === 'portrait') {
    // portrait
    return '130%';
  } else {
    // landscape
    return '70%';
  }
};

const openPhotoSwipe = (items, index) => {
  const pswpElement = document.querySelectorAll('.pswp')[0];

  var options = {
    index,
    showAnimationDuration: 0,
    hideAnimationDuration: 0
  };

  var gallery = new PhotoSwipe(
    pswpElement,
    PhotoSwipeUI_Default,
    items,
    options
  );

  gallery.init();
};

const renderImageGridItem = (img, galleryItems, orientation, index) => {
  const imgOrientation = orientation ? orientation : img.node.orientation;

  const imgSize = getImageSize(
    img.node.width,
    img.node.height,
    img.node.orientation
  );

  const containerPadding = imgContainerPadding(imgOrientation);

  return (
    <ImageGridItem
      onClick={() => openPhotoSwipe(galleryItems, index)}
      data-size={`${imgSize.width}x${imgSize.height}`}
      key={img.node.publicId}
      thumb={`${img.node.thumb}`}
      imgUrl={`${img.node.imgUrl}`}
      orientation={imgOrientation}
      padding={containerPadding}
      itemProp="contentUrl"
    />
  );
};

const renderRows = (columns, images, galleryItems, orientation) => {
  let counter = 0;

  return columns.map((row, index) => {
    if (index !== 0) {
      counter = counter + columns[index - 1];
    }

    const rowImages = images.slice(counter, counter + row);

    return (
      <ImageGridRow columns={row} key={counter} imgCount={row}>
        {rowImages.map(img => {
          const index = galleryItems.findIndex(
            item => item.filename === img.node.filename
          );
          return renderImageGridItem(img, galleryItems, orientation, index);
        })}
      </ImageGridRow>
    );
  });
};

const getListOfGalleryItems = (images, imagesVisibleCount) => {
  let items = images.map(image => {
    return {
      publicId: image.node.public_id,
      src: `${image.node.imgUrl}`,
      w: image.node.width,
      h: image.node.height,
      title: image.node.context && image.node.context.custom && image.node.context.custom.alt ? image.node.context.custom.alt : '',
      caption: image.node.context && image.node.context.custom && image.node.context.custom.caption ? image.node.context.custom.caption : '',
    };
  });

  if (imagesVisibleCount && items.length > imagesVisibleCount) {
    items = items.slice(0, imagesVisibleCount);
  }

  return items;
};

const isOdd = num => num % 2;

class ImageGrid extends Component {
  componentDidMount() {
    window.PhotoSwipe = PhotoSwipe;
    window.PhotoSwipeUI_Default = PhotoSwipeUI_Default;
  }

  render() {
    const { folder, columns, data, orientation } = this.props;
    let imageGridColumns = 2;
    let columnsPerRow;
    let galleryItems;

    const images = data.cloudinaryImage.edges.filter(
      image => image.node.folder === folder
    );

    if (isOdd(images.length) === 1) {
      imageGridColumns = 3;
    }

    if (columns && columns.length > 0) {
      columnsPerRow = columns.split(',').map(Number);
      const imagesVisibleCount = columnsPerRow.reduce(
        (partialSum, a) => partialSum + a
      );
      galleryItems = getListOfGalleryItems(images, imagesVisibleCount);
    } else {
      galleryItems = getListOfGalleryItems(images);
    }

    return (
      <Fragment>
        <ImageGridWrapper>
          {columns && columns.length > 0 ? (
            <Fragment>
              {renderRows(columnsPerRow, images, galleryItems, orientation)}
            </Fragment>
          ) : (
            <ImageGridRow columns={imageGridColumns}>
              {images.map((img, index) =>
                renderImageGridItem(img, galleryItems, orientation, index)
              )}
            </ImageGridRow>
          )}
        </ImageGridWrapper>
        <PhotoSwipeDOM />
      </Fragment>
    );
  }
}

const ImageGridWrapper = styled.div`
  display: block;
`;

const ImageGridRow = styled.div`
  display: grid;
  grid-gap: 1em;
  grid-template-columns: ${props => `repeat(${props.columns}, 1fr)`};
  margin-bottom: 1em;
`;

const ImageGridItem = styled.a`
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
  folder: PropTypes.string.isRequired
};

export default ImageGrid;
