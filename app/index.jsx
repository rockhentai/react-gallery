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
    this.Constant = {
      centerPos:{
        left:0,
        right:0
      },
      hPosRange:{//水平方向的取值范围
        leftSecX:[0,0],
        rightSecX:[0,0],
        y:[0,0]
      },
      vPosRange:{//垂直方向
        x:[0,0],
        topY:[0,0]
      }
    }
  }

  // Constant:{
  //   centerPos:{
  //     left:0,
  //     right:0
  //   },
  //   hPosRange:{//水平方向的取值范围
  //     leftSecX:[0,0],
  //     rightSecX:[0,0],
  //     y:[0,0]
  //   },
  //   vPosRange:{//垂直方向
  //     x:[0,0],
  //     topY:[0,0]
  //   }
  // }

  //重新布局所有图片，指定居中哪个图片
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,
        Constant = this.Constant,
        centerPos = Constant.centerPos;
  }

  getInitialStage() {
    return {
      imgsArrangeArr:[
        // {
        //   pos:{
        //     left:'0',
        //     top:'0'
        //   }
        // }
      ]
    }
  }

  componentDidMount() {
    const stageDOM = ReactDOM.findDOMNode(this.refs.stage),
          stageW = stageDOM.scrollWidth,
          stageH = stageDOM.scrollHeight,
          halfStageW = Math.ceil(stageW/2),
          halfStageH = Math.ceil(stageH/2);
    //拿到一个imageFigure的大小
    const imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0),
          imgW = imgFigureDOM.scrollWidth,
          imgH = imgFigureDOM.scrollHeight,
          halfImgW = Math.ceil(imgW/2),
          halfImgH = Math.ceil(imgH/2);

    //中心图片位置点
    this.Constant.centerPos = {
      left:halfStageW - halfImgW,
      top:halfStageH - halfImgH
    }
    //计算左侧右侧图片排布范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW*3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW - halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfImgW - imgW;
    this.Constant.vPosRange.x[1] = halfImgW;

    this.rearrange(0);
  }

  render() {
    var controllerUnits = [];
    var imgFigures = [];

    imageDatas.forEach(function(value,index) {
      if(!this.state.imgsArrangeArr[index]) {
        this.state.imgsArrangeArr[index] = {
          pos:{
            left:0,
            top:0
          }
        }
      }
      imgFigures.push(<ImgFigure data={value} ref={'imgFigure' + index} />)
    }.bind(this));

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    )
  }
}

class ImgFigure extends React.Component {
  render() {
    return (
      <figure className="img-figure">
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    )
  }
}

const content = document.createElement('div');
content.className = content;
document.body.appendChild(content);
ReactDOM.render(<GalleryByReactApp />,content);
