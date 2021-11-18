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
const filterObj = {
  paper: ['string'],
  test_name: ['string'],
  test_level: ['string'],
  test_status: ['string'],
  tags: [] = [],
}

export default class Program extends React.Component {

  state = {
    code: '',
    language: 'javascript',
    theme: PROGRAM_THEME.VS,
    visible: false,
    exam: [] = [''],
    examTest: [] = [],
    preparation: false, // 标识“筛选”按钮的点击
    filter: false, // 标识“筛选试题要求”按钮的点击
    count: 1, // 页数
    test_filter: [] = [],
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
        exam: arr
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
  choiceLevel = async (node: any) => {
    const cookie = getCookie();
    const filter: string = node.target.value;
    // const { test_filter } = this.state;
    // const sign = TEST_LEVEL.EASY || TEST_LEVEL.MIDDLE || TEST_LEVEL.HARD;
    // const arr: any[] = test_filter.length > 0 ? test_filter : [];
    // if (test_filter.length === 0) {
    //   const arr = [];
    //   arr.push(filter)
    //   this.setState({ test_filter: arr });
    // } else {
    //   this.setState({
    //     test_filter: test_filter.map(item => {
    //       item === sign ? filter : item;
    //     })
    //   })
    // }
    filterObj.test_level.push(filter);
    const res = await search({ cookie, filterObj });
    this.setState({ examTest: res.data.ret, filter: true, cookie });
    // this.setState({ examTest: res.data.ret, filter: true, test_filter: arr });
  }
  choiceStatus = async (node: any) => {
    const cookie = getCookie();
    const filter: string = node.target.value;
    // const { test_filter } = this.state;
    // const arr: any[] = test_filter;
    // if (arr.length === 0) {
    //   arr[0] = filter;
    // } else {
    //   arr.map(item => {
    //     console.log((item === TEST_LEVEL.EASY || item === TEST_LEVEL.MIDDLE || item === TEST_LEVEL.HARD) || (item === TEST_STATUS.NODO || item === TEST_STATUS.DOING || item === TEST_STATUS.DONE))
    //     if ((item === TEST_LEVEL.EASY || item === TEST_LEVEL.MIDDLE || item === TEST_LEVEL.HARD) || (item === TEST_STATUS.NODO || item === TEST_STATUS.DOING || item === TEST_STATUS.DONE)) {
    //       item = filter;
    //       return;
    //     }
    //   })
    // }
    filterObj.test_status.push(filter);
    const res = await search({ cookie, filterObj });
    this.setState({ examTest: res.data.ret, filter: true,  });
    // this.setState({ examTest: res.data.ret, filter: true, test_filter: arr });
  }
  // choiceStatus = (node: any) => {
  //   const cookie = getCookie();
  //   const filter: string = node.target.value;
  //   const { test_filter } = this.state;
  //   const arr: any[] = test_filter;
  //   if (arr.length === 0) {
  //     arr[0] = filter;
  //   } else {
  //     arr.map(item => {
  //       console.log((item === TEST_LEVEL.EASY || item === TEST_LEVEL.MIDDLE || item === TEST_LEVEL.HARD) || (item === TEST_STATUS.NODO || item === TEST_STATUS.DOING || item === TEST_STATUS.DONE))
  //       if ((item === TEST_LEVEL.EASY || item === TEST_LEVEL.MIDDLE || item === TEST_LEVEL.HARD) || (item === TEST_STATUS.NODO || item === TEST_STATUS.DOING || item === TEST_STATUS.DONE)) {
  //         item = filter;
  //         return;
  //       }
  //     })
  //   }
  //   search({ cookie, filter }).then(res => {
  //     this.setState({ examTest: res.data.ret, filter: true, test_filter: arr });
  //   })
  // }

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
    const { language, theme, visible, examTest, exam, preparation, count, test_filter, filter, } = this.state;
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
      { value: '标签', placeholder: '标签' },
    ]
    const existChoice = [
      { value: '难度', radio: level, func: this.choiceLevel },
      { value: '状态', radio: status, func: this.choiceStatus },
      // { value: '难度', radio: level, func: this.choiceStatus },
      // { value: '状态', radio: status, func: this.choiceStatus },
    ]
    // console.log('哈哈哈哈哈哈哈哈哈哈哈哈', test_filter, test_filter.length)
    // console.log('dddddddd', examTest)

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
                      style={{ width: 200 }}
                      placeholder={ exam && exam[0] }
                      optionFilterProp="children"
                      onChange={ this.searchExam } // 选中 option，或 input 的 value 变化时，调用此函数
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
                      open={ false }
                      style={{ width: 200 }}
                      placeholder="搜索题目"
                      // optionFilterProp="children"
                      onSearch={ this.searchTest } // 文本框值变化时回调		
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
                      test_filter.map(item => {
                        return (
                          <div className="filter-button">{ item }<CloseOutlined /> </div>
                        )
                      })
                    }
                    <div className="filter-button-delete"><DeleteOutlined /></div>
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
                                onChange={ item.func }
                                // onChange={ this.choiceStatus }
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
                      examTest.map(item => {
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

          {/* <div className="right-top">
            <Select 
              defaultValue={ language } 
              style={{ width: 120 }} 
              onChange={ this.handleChange }
              className="right-top-button"
            >
              {
                PROGRAM_LANGUAGE.map(item => {
                  return(
                    <Select.Option value={ item }> { item } </Select.Option>
                  )
                })
              }
            </Select>
            
            <Select 
              defaultValue={ theme } 
              style={{ width: 120 }} 
              onChange={ this.handleChange }
              className="right-top-button"
            >
              {
                THEME.map(item => {
                  return(
                    <Select.Option value={ item }> { item } </Select.Option>
                  )
                })
              }
            </Select>
          </div> */}

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