import './main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
//import imageDatas from './data/imageDatas.json';

//获取图片数据
var imageDatas = require('./data/imageDatas.json');
function genImageURL(imageDatasArr) {
  for(var i=0,j=imageDatasArr.length;i<j;i++) {
    var singleImageData = imageDatasArr[i];
    singleImageData.imageURL = require('./images/' + singleImageData.fileName);
    imageDatasArr[i] = singleImageData;
  }
  return imageDatasArr;
  console.log('sadf');
}
//将图片名改成图片url路径信息
imageDatas = genImageURL(imageDatas);

class GalleryByReactApp extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <section className="stage">
        <section className="img-sec">
        </section>
        <nav className="controller-nav">
        </nav>
      </section>
    )
  }
}

const content = document.createElement('div');
content.className = content;
document.body.appendChild(content);
ReactDOM.render(<GalleryByReactApp />,content);
