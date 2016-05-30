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
}
//将图片名改成图片url路径信息
imageDatas = genImageURL(imageDatas);

//获取区间内的随机值
function getRangeRandom(low,high) {
  return Math.ceil(Math.random() * (high - low) + low);
}

//获取0~30度之间的任意正负值
function get30DegRandom() {
  return ((Math.random() >0.5 ? '' : '-') + Math.ceil(Math.random()*30));
}

class GalleryByReactApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {imgsArrangeArr:[]};
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

  //翻转图片 return一个闭包函数
  inverse(index) {
    return function() {
      var imgsArrangeArr = this.state.imgsArrangeArr;
      imgsArrangeArr[index].isInverse = !imgsArrangeArr[index].isInverse;
      this.setState({
        imgsArrangeArr:imgsArrangeArr
      })
    }.bind(this);
  }

  //重新布局所有图片，指定居中哪个图片
  rearrange(centerIndex) {
    var imgsArrangeArr = this.state.imgsArrangeArr,//存储所有pos的数组
        Constant = this.Constant,
        centerPos = Constant.centerPos,
        hPosRange = Constant.hPosRange,
        vPosRange = Constant.vPosRange,
        hPosRangeLeftSecX = hPosRange.leftSecX,
        hPosRangeRightSecX = hPosRange.rightSecX,
        hPosRangeY = hPosRange.y,
        vPosRangeTopY = vPosRange.topY,
        vPosRangeX = vPosRange.x,

        imgsArrangeTopArr = [],
        //取一个或者不取
        topImgNum = Math.floor(Math.random()*2),
        topImgSpliceIndex = 0,
        imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex,1);//从imgsArrangeArr中删除centerIndex位置的项目并返回

    //居中centerIndex的图片
    imgsArrangeCenterArr[0] = {
      pos:centerPos,
      rotate:0,
      isCenter:true
    }

    //取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex,topImgNum);
    //布局位于上侧的图片
    imgsArrangeTopArr.forEach(function(value,index) {
      imgsArrangeTopArr[index] = {
        pos:{
          top:getRangeRandom(vPosRangeTopY[0],vPosRangeTopY[1]),
          left:getRangeRandom(vPosRangeX[0],vPosRangeX[1])
        },
        rotate:get30DegRandom(),
        isCenter:false
      }
    });

    //布局左右两侧的
    for(var i=0,j=imgsArrangeArr.length,k=j/2;i<j;i++) {
      var hPosRangeLORX = null;
      //前半部分布局左边，右半部份右边
      if(i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i] = {
        pos:{
          top:getRangeRandom(hPosRangeY[0],hPosRangeY[1]),
          left:getRangeRandom(hPosRangeLORX[0],hPosRangeLORX[1])
        },
        rotate:get30DegRandom(),
        isCenter:false
      }
    }

    if(imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex,0,imgsArrangeTopArr[0])
    }

    imgsArrangeArr.splice(centerIndex,0,imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr:imgsArrangeArr
    })

  }

  center(index) {
    return function() {
      this.rearrange(index);
    }.bind(this);
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
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfStageH - halfImgH * 3;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

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
          },
          rotate:0,
          isInverse:false,
          isCenter:false
        }
      }
      imgFigures.push(<ImgFigure key={index} data={value} ref={'imgFigure' + index}
      arrange={this.state.imgsArrangeArr[index]}
      inverse={this.inverse(index)}
      center={this.center(index)} />);

      controllerUnits.push(<ControllerUnit key={index} arrange={this.state.imgsArrangeArr[index]} inverse={this.inverse(index)} center={this.center(index)} />);

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

  handleClick(e) {

    if(this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {

    var styleObj = {};

    //如果props属性中指定了这张图片的位置，则使用
    if(this.props.arrange.pos) {
      styleObj = this.props.arrange.pos;
    }

    if(this.props.arrange.rotate) {
      (['MozTransform','msTransform','WebkitTransform','transform']).forEach(function(value) {
        styleObj[value] = 'rotate(' + this.props.arrange.rotate + 'deg)';
      }.bind(this));
    }

    if(this.props.arrange.isCenter) {
      styleObj.zIndex = 11;
    }

    var imgFigureClassName = "img-figure";
    imgFigureClassName += this.props.arrange.isInverse ? ' is-inverse' : '';

    return (
      <figure className={imgFigureClassName} style={styleObj} onClick={this.handleClick.bind(this)}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
          <div className="img-back">
            <p>
              {this.props.data.desc}
            </p>
            <iframe src={"http://music.163.com/outchain/player?type=2&id=" + this.props.data.id + "&auto=0&height=32"}>
            </iframe>
          </div>
        </figcaption>
      </figure>
    )
  }
}

//控制组件
class ControllerUnit extends React.Component {
  constructor(props) {
    super(props);
  }

  handleClick(e) {
    if(this.props.arrange.isCenter) {
      this.props.inverse();
    } else {
      this.props.center();
    }
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    var controllerUnitClassName = "controller-unit";

    if(this.props.arrange.isCenter) {
      controllerUnitClassName += " is-center";

      if(this.props.arrange.isInverse) {
        controllerUnitClassName += " is-inverse";
      }
    }

    return (
      <span className={controllerUnitClassName} onClick={this.handleClick.bind(this)}>
      </span>
    )
  }
}

const content = document.createElement('div');
content.className = content;
document.body.appendChild(content);
ReactDOM.render(<GalleryByReactApp />,content);
