import React from 'react';
import { Button, Select, Drawer, Radio, message } from 'antd';
import { connect } from 'react-redux';
import {
  LeftOutlined,
  RightOutlined,
  UnorderedListOutlined,
  CaretRightOutlined,
  DownOutlined,
  FilterOutlined,
  CheckOutlined,
  DeleteOutlined,
  UpOutlined,
  CloseOutlined,
} from '@ant-design/icons';

import 'style/candidate/drawer.css';
import 'style/candidate/program.less';
import CodeEditor from 'src/common/components/candidate/codeEditor';
import ProgramInform from 'common/components/candidate/programInform';
import { getCookie, getExamLevel, getUrlParam } from 'common/utils';
import { search, submit } from 'api/modules/candidate';
import { CANDIDATE_TEST, PROGRAM_THEME, TEST_LEVEL, TEST_STATUS, } from 'src/common/const';
import { GET_EXAM, GET_PROGRAM_EXAM } from 'src/useRedux/constant';

const cookie = getCookie();

interface Prop {
  programExam: string;
}
// interface examObj {
//   testStatus: string;
//   testName: string;
//   testLevel: string;
// }
interface examTestObj {
  paper: string;
  testName: string;
  testLevel: string;
  testStatus: string;
  tags: string;
}
interface testFilterObj {
  label: string;
  // value: number;
  type: string;
}
interface State {
  code: string;
  language: string;
  theme: string;
  visible: boolean;
  exam: string[];              // 请求的所有试卷
  examTest: examTestObj[];      // 该用户的所有试题
  preparation: boolean;         // 标识“筛选”按钮的点击，显示可供筛选的所有要求
  count: number;                // 页数
  filterArr: examTestObj[];     // 筛选过后的数组
  testFilter: testFilterObj[];  // 筛选试题的要求
}

class Program extends React.Component<Prop, State> {

  state = {
    code: '',
    language: 'javascript',
    theme: 'vs',
    visible: false,
    exam: [],
    examTest: [],
    preparation: false,   // 标识“筛选”按钮的点击，显示可供筛选的所有要求
    filterArr: [],   // 筛选过后的数组
    count: 1,             // 页数
    testFilter: [] 
  }

  
  componentDidMount() {
    const { programExam } = this.props;
    const testName = getUrlParam('test');

    search({ cookie }).then(res => {
      const ret = res.data.ret;
      const examArr: string[] = [];
      const examTestArr: examTestObj[] = [];

      ret.map((item: any) => {
        if (examArr.indexOf(item.paper) === -1) {
          examArr.push(item.paper);
        } 
        if (examTestArr.indexOf(item.test_name) === -1) {
          examTestArr.push(item);
        }
      })
      this.setState({ 
        examTest: examTestArr,
        exam: examArr,
        filterArr: ret
      });
    })
    submit({ cookie, paper: programExam, testName, submit: false });
  }

  // 获取子组件（代码编辑器）的 code
  getProgramCode = (value: string) => {
    this.setState({ code: value })
  }
  // 提交代码，需要验证代码的正确性（待完善），如果正确则将 status 改为 true
  submitCode = async () => {
    const { code, language } = this.state;
    const { programExam } = this.props;
    const testName = getUrlParam('test');
    const res = await submit({ cookie, paper: programExam, testName, code, language, status: false, submit: true });
    if (res.data.status === true) {
      message.success('代码提交成功');
    } else {
      message.error('代码提交失败');
    }
  }

  // 动态修改代码编辑器的支持语言
  handleChange = (value: any) => {
    this.setState({ language: value });
  }
  
  // 展示题目列表
  openModal = () => {
    this.setState({ visible: true });
  }
  // 关闭题目列表
  onClose = () => {
    this.setState({ visible: false });
  }

  // 选中“搜索试卷”按钮时请求试卷信息
  searchExam = async (value: string, option: any) => {
    const { filterArr } = this.state;

    const res = await search({ cookie, paper: value });
    this.setState({ examTest: res.data.candidateInform });
  }

  // 筛选试题
  filter = () => {
    const { preparation } = this.state;
    this.setState({ preparation: !preparation })
  }
  
  // 选中试题 难度/状态 后的更新字段，以便渲染对应的试题
  choice = async (item?: any) => {
    const { testFilter, examTest, exam } = this.state;
    const copyFilterArr = testFilter.slice();
    let paper: string = '', testName: string = '', testLevel: string = '', testStatus: string = '', tags: string = '';
    
    if (item != undefined) {
      const value = item && item.target && item.target.value ? item.target.value : item;
      const findTest = examTest.find((para) => para.test_name === item);
      const findExam = exam.find((para) => para === item);
      const objType: string = ['简单', '中等', '困难'].includes(value) ? 'testLevel' : ['未做', '已解答', '尝试中'].includes(value) ? 'testStatus' : findTest !== undefined ? 'testName' : findExam !== undefined ? 'paper' : 'tags';
      const obj: testFilterObj = {
        label: value,
        type: objType
      }
  
      if (copyFilterArr.length > 0) {
        const ret = copyFilterArr.find((item) => item.type === objType );
        if (ret === undefined) {
          copyFilterArr.push(obj);
        } else {
          copyFilterArr.map(item => {
            if (item.type === objType) {
              item.label = value;
            }
          })
        }
      } else {
        copyFilterArr.push(obj);
      }
    }
      
    copyFilterArr.map(item => {
      // if (item.type === objType) {

      // }
      if (item.type === 'testLevel') {
        testLevel = item.label;
      } else if (item.type === 'testStatus') {
        testStatus = item.label;
      } else if (item.type === 'testName') {
        testName = item.label;
      } else if (item.type === 'paper') {
        paper = item.label;
      }
    })

    const afterFilterArr = examTest.filter((item) => {
      if (
        item['paper'].indexOf(paper) !== -1 && 
        item['test_name'].indexOf(testName) !== -1 && 
        item['test_level'].indexOf(testLevel) !== -1 && 
        item['test_status'].indexOf(testStatus) !== -1 
        // item['tags'].indexOf(tags) !== -1
      ) {
        return item;
      }
    })

    this.setState({ 
      filterArr: afterFilterArr, 
      testFilter: copyFilterArr, 
    });
  }
  deleteChoice = (val: string) => {
    const { testFilter } = this.state;
    const copyArr = testFilter.slice();
    const noDeleteArr = copyArr.filter(item => item.label !== val);
    this.setState({ 
      testFilter: noDeleteArr 
    }, () => {
      this.choice();
    });
  }
  deleteAllChoice = () => {
    let { testFilter, examTest } = this.state;
    let modify = testFilter.slice();
    modify = [];
    this.setState({ testFilter: modify, filterArr: examTest });
  }

  // 展示上一页试题
  previousPage = () => {

  }
  // 展示下一页试题
  nextPage = () => {

  }
  // 上一题
  previousTest = () => {
    
  }
  // 下一题
  nextTest = () => {

  }
  
  renderDrawer = () => {
    const { visible, exam, preparation, count, testFilter, filterArr, } = this.state;
    const level = [
      { label: TEST_LEVEL.EASY, value: TEST_LEVEL.EASY },
      { label: TEST_LEVEL.MIDDLE, value: TEST_LEVEL.MIDDLE },
      { label: TEST_LEVEL.HARD, value: TEST_LEVEL.HARD },
    ];
    const status = [
      { label: TEST_STATUS.NODO, value: TEST_STATUS.NODO },
      { label: TEST_STATUS.DONE, value: TEST_STATUS.DONE },
      { label: TEST_STATUS.DOING, value: TEST_STATUS.DOING },
    ]
    const existSearch = [
      { value: '标签', placeholder: '标签', },
    ]
    const existChoice = [
      { value: '难度', radio: level },
      { value: '状态', radio: status },
    ]

    return(
      <Drawer
        width="60%"
        visible={ visible }
        onClose={ this.onClose }
        closable={ false }
        placement="left"
        className="drawer"
      >
        <div className="drawer-box">
          <div className="top">
            <div className="top-left">
              {/* 搜索该候选人的试卷 */}
              <Select
                showSearch
                key="searchCandidateExam"
                style={{ width: 200 }}
                // placeholder={ exam && exam[0] }
                optionFilterProp="children"
                onChange={ this.choice } // 选中 option，或 input 的 value 变化时，调用此函数
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {
                  exam.map(item => {
                    return(
                      <Select.Option value={ item }  key={ item } >{ item }</Select.Option>
                    )
                  })
                }
              </Select>
            </div>

            <div className="top-right">
              {/* 搜索全部试题，包括该候选人的其他试卷下的试题 */}
              <Select
                showSearch
                key="searchCandidateTest"
                open={ false }
                style={{ width: 200 }}
                placeholder="搜索题目"
                // optionFilterProp="children"
                onSearch={ this.choice } // 文本框值变化时回调		
                // filterOption={(input, option) =>
                //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                // }
              >
                {/* {
                  examTest.map(item => {
                    return(
                      <Select.Option value={ item['test_name'] } key={ item['test_name'] }>{ item['test_name'] }</Select.Option>
                    )
                  })
                } */}
              </Select>
              <div className="top-gap"></div>

              {/* “筛选”按钮 */}
              <Button 
                className="top-button" 
                onClick={ this.filter } 
                type="ghost"
                >
                <FilterOutlined/>
              </Button>
              <div className="top-gap"></div>

              {/* “页数”按钮 */}
              <Select
                // style={{ width: 200 }}
                placeholder={ count }
                optionFilterProp="children"
                // onChange={ this.onChange } // 选中 option，或 input 的 value 变化时，调用此函数
              >
                {
                  exam.map(item => {
                    return(
                      <Select.Option value={ count }  key={ count } >{ count }</Select.Option>
                    )
                  })
                }
              </Select>
              <div className="top-gap"></div>

              {/* “上一页”按钮 */}
              <Button 
                className="top-button" 
                onClick={ this.previousPage }
                type="ghost"
                >
                  <LeftOutlined/>
              </Button>
              <div className="top-gap"></div>

              {/* “下一页”按钮 */}
              <Button 
                className="top-button" 
                onClick={ this.nextPage }
                type="ghost"
              >
                <RightOutlined/>
              </Button>
            </div>

          </div>

          {
            testFilter.length > 0 ?
            <div className="exist filter-box">
              {
                testFilter.map(item => {
                  return (
                    <div className="filter-button">
                      { item.label }
                      <CloseOutlined onClick={ () => this.deleteChoice(item.label) }/> 
                    </div>
                  )
                })
              }
              <div >
                <DeleteOutlined 
                  className="filter-button-delete" 
                  onClick={ this.deleteAllChoice }
                />
              </div>
            </div> : null
          }
          {
            preparation === true ? 
            <div className="exist">
              <div className="exist-content">
                {
                  existChoice.map(item => {
                    return(
                      <div className="exist-content-box">
                        <div className="exist-content-span">{ item.value }</div>
                        <Radio.Group 
                          options={ item.radio }  
                          optionType="button"
                          buttonStyle="solid"
                          onChange={ this.choice }
                          className="background-button"
                        />
                      </div>
                    )
                  })
                }
                {
                  existSearch.map(item => {
                    return(
                      <div className="exist-content-box">
                        <div className="exist-content-span">{ item.value }</div>
                        <Select style={{ width: 120 }} placeholder={ item.placeholder }>
                          <Select.Option value="lucy">Lucy</Select.Option>
                        </Select>
                      </div>
                    )
                  })
                }
              </div>

              <span className="exist-icon" onClick={ this.filter }><UpOutlined/></span>
            </div> : null
          }

          <div className="content">
            <div className="content-box">
              {
                filterArr.map(item => {
                  return(
                    <a className="content-test-box" href={ `${ CANDIDATE_TEST }?test=${ item['test_name'] }` }>
                      <div className="content-test-left">
                        <span className="content-test-icon">
                          { getUrlParam('test') === item['test_name'] ? <RightOutlined /> : item['test_status'] === TEST_STATUS.DONE ? <CheckOutlined /> :  undefined }
                        </span>
                        <span className="content-test-font">
                          { item['num'] }. { item['test_name'] }
                        </span>
                      </div>
                      <span className={['content-test-right', getExamLevel(item['test_level'])].join(' ')}>
                        { item['test_level'] }
                      </span>
                    </a>
                  )
                })
              }
            </div>
          </div>
        </div>
      </Drawer>
    )
  }

  render() {
    const { language, theme, } = this.state;
    
    return(
      <div className="whole">

        <div className="left">
          <div className="left-box">
            <ProgramInform />
          </div>

          <div className="left-bottom">
            { this.renderDrawer() }

            <Button className="left-bottom-list left-bottom-button" onClick={ this.openModal }>
              <UnorderedListOutlined />
              题目列表
            </Button>

            <Button className="left-bottom-next left-bottom-button" onClick={ this.nextTest }>
              下一题
              <RightOutlined/>
            </Button>

            <Button className="left-bottom-previous left-bottom-button" onClick={ this.previousTest }>
              <LeftOutlined/>
              上一题
            </Button>
            
          </div>
        </div>




        <div className="right">

          <div className="right-content">
            <CodeEditor getProgramCode={ this.getProgramCode.bind(this) } language={ language }/>
          </div>

          <div className="right-bottom">
            {/* <div> */}
              <Button 
                className="right-bottom-submit right-bottom-button"
                type="primary"
                onClick={ this.submitCode }
              >
                提交
              </Button>

              <Button 
                className="right-bottom-execute right-bottom-button"
              >
                <CaretRightOutlined />
                执行代码
                <DownOutlined />
              </Button>
            {/* </div> */}
          </div>

        </div>

      </div>
    )
  }
}

function mapStateToProps(state: any) {
  return{
    programExam: state.programExam
  }
}
const ProgramContainer = connect(mapStateToProps)(Program)
export default ProgramContainer;