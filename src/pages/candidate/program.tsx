import React from 'react';
import { Button, Select, Drawer, Radio, Input, } from 'antd';
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
import { TEST, PROGRAM_THEME, TEST_LEVEL, TEST_STATUS, } from 'src/common/const';

const cookie = getCookie();

interface filter{
  exam: string,
  test_name: string,
  test_level: string,
  test_status: string,
  tags: string[],
}
export default class Program extends React.Component {

  dele = (e: any) => {
    console.log(e)
  }

  state = {
    code: '',
    language: 'javascript',
    theme: PROGRAM_THEME.VS,
    visible: false,
    exam: [] = [],
    examTest: [] = [],
    preparation: false,   // 标识“筛选”按钮的点击，显示可供筛选的所有要求
    filter: false,        // 标识“筛选试题要求”按钮的点击，点击过后显示已经筛选的信息
    filterArr: [] = [],   // 筛选过后的数组
    count: 1,             // 页数
    test_filter: [] = [
      { paper: '', class_name: 'paper'}, 
      { test_name: '', class_name: 'test_name'}, 
      { test_level: '', class_name: 'test_level'}, 
      { test_status: '', class_name: 'test_status'}, 
      { tags: '', class_name: 'tags'}, 
    ]  // 试卷名、试题名、试题难度、试题完成状态、试题标签
  }

  componentDidMount() {
    search({ cookie }).then(res => {
      const ret = res.data.ret;
      const arr: string[] = [];
      arr.push('全部试卷')
      ret.map((item: any) => {
        if (arr.indexOf(item.paper) === -1) {
          arr.push(item.paper);
        } 
      })
      this.setState({ 
        examTest: ret,
        exam: arr,
        filterArr: ret
      });
    })
  }

  // 获取子组件（代码编辑器）的 code
  getProgramCode = (value: any) => {
    this.setState({ code: value })
  }
  // 提交代码，需要验证代码的正确性（待完善），如果正确则将 status 改为 true
  submitCode = async () => {
    const { code } = this.state;
    const url = getUrlParam('test');
    const res = await submit({ testName: url, code: code, status: false });
    console.log(res);
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
  onClose =() => {
    this.setState({ visible: false });
  }

  // 选中“搜索试卷”按钮时请求试卷信息
  searchExam = async (value: string, option: any) => {
    const { filterArr } = this.state;

    const res = await search({ cookie, paper: value });
    this.setState({ examTest: res.data.candidateInform });
  }
  // 选中“搜索试题”按钮时请求试题信息
  searchTest = async (value: string) => {
    const res = await search({ cookie, testName: value });
    this.setState({ examTest: res.data.ret });
  }

  // 筛选试题
  filter = () => {
    const { preparation } = this.state;
    preparation === false ? this.setState({ preparation: true }) : this.setState({ preparation: false });
  }
  
  // 选中试题 难度/状态 后的更新字段，以便渲染对应的试题
  choice = async (value: any) => {
    const filter: string =  value.target.value;
    const { test_filter, examTest } = this.state;
    let paper = test_filter[0], test_name = test_filter[1], test_level = test_filter[2].test_level, test_status = test_filter[3].test_status, tags = test_filter[4];

    if (filter === TEST_LEVEL.EASY || filter === TEST_LEVEL.MIDDLE || filter === TEST_LEVEL.HARD) {
      test_level = filter;
      test_filter[2].test_level = filter;
    } else if (filter === TEST_STATUS.NODO || filter === TEST_STATUS.DOING || filter === TEST_STATUS.DONE) {
      test_status = filter;
      test_filter[3].test_status = filter;
    }
    const after = examTest.filter((item: filter) => {
      if (item['test_level'].indexOf(test_level) !== -1 && item['test_status'].indexOf(test_status) !== -1) {
      // if (item['paper'].indexOf(paper) !== -1 && item['test_name'].indexOf(test_name) !== -1 && item['test_level'].indexOf(test_level) !== -1 && item['test_status'].indexOf(test_status) !== -1) {
        return item;
      }
    })
    this.setState({ filterArr: after, test_filter, filter: true });
  }
  deleteChoice = (e: any) => {
    console.log(this.dele)
    // const className = this.dele.current.className
    // const div = document.querySelector(`.${ className }`) as HTMLElement;
    // console.log(div)
  }
  deleteAllChoice = () => {
    let { test_filter, examTest } = this.state;
    test_filter = [
      { paper: '', class_name: 'paper'}, 
      { test_name: '', class_name: 'test_name'}, 
      { test_level: '', class_name: 'test_level'}, 
      { test_status: '', class_name: 'test_status'}, 
      { tags: '', class_name: 'tags'}, 
    ];
    this.setState({ test_filter, filter: false, filterArr: examTest });
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
  id = 0;
  nextTest = () => {
    const { examTest } = this.state;
    console.log(examTest)
    
  }

  render() {
    const { language, theme, visible, examTest, exam, preparation, count, filter, test_filter, filterArr, } = this.state;
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
      // { value: '分类', placeholder: '全部' },
      { value: '标签', placeholder: '标签', },
    ]
    const existChoice = [
      { value: '难度', radio: level },
      { value: '状态', radio: status },
    ]

    return(
      <div className="whole">

        <div className="left">
          <div className="left-box">
            <ProgramInform />
          </div>

          <div className="left-bottom">
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
                    {/* <Input.Search 
                      defaultValue="搜索题目" 
                      onChange={ this.searchTest } 
                      style={{ width: 200 }} 
                    /> */}
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
                  filter === true ?
                  <div className="exist filter-box">
                    {
                      test_filter.map((item,index)=> {
                        const allValue = Object.values(item);
                        const value = allValue[0], classValue = allValue[1];
                        if (value !== '') {
                          return (
                            <div key={value} className={ classValue } ref={ this.dele }>
                              { value }
                              <CloseOutlined onClick={ this.dele }/> 
                            </div>
                          )
                        }
                      })
                    }
                    <div >
                      <DeleteOutlined className="filter-button-delete" onClick={ this.deleteAllChoice }/>
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
                          <a className="content-test-box" href={ `${ TEST }?test=${ item['test_name'] }` }>
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