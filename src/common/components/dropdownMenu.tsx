import React from 'react';
import { Select, Menu, Dropdown, Button, Popover,   } from 'antd';
import { DownOutlined } from '@ant-design/icons';

export default class DropdownMenu extends React.PureComponent{
  render() {
    const text = <span>Title</span>;
    const content = (
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    );


    return(
      <div>
        <Popover placement="bottom" title={text} content={content} trigger="click">
          <Button>知识点 <DownOutlined/> </Button>
        </Popover>
      </div>
    )
  }
}