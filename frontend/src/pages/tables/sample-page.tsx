import Typography from '@mui/material/Typography';
import MainCard from 'components/MainCard';
import type { ColumnsState, ProColumns } from '@ant-design/pro-components';
import { ProTable } from '@ant-design/pro-components';
import React from 'react';
import { useState } from 'react';

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error',
};

export type TableListItem = {
  key: number;
  name: string;
  status: string;
  updatedAt: number;
  createdAt: number;
  money: number;
};
const tableListDataSource: TableListItem[] = [];

for (let i = 0; i < 2; i += 1) {
  tableListDataSource.push({
    key: i,
    name: `TradeCode ${i}`,
    status: valueEnum[((Math.floor(Math.random() * 10) % 4) + '') as '0'],
    updatedAt: Date.now() - Math.floor(Math.random() * 1000),
    createdAt: Date.now() - Math.floor(Math.random() * 2000),
    money: Math.floor(Math.random() * 2000) * i,
  });
}

const columns: ProColumns<TableListItem>[] = [
  {
    title: '标题',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '状态',
    dataIndex: 'status',
    initialValue: 'all',
    filters: true,
    onFilter: true,
    valueType: 'select',
    valueEnum: {
      all: { text: '全部', status: 'Default' },
      close: { text: '关闭', status: 'Default' },
      running: { text: '运行中', status: 'Processing' },
      online: { text: '已上线', status: 'Success' },
      error: { text: '异常', status: 'Error' },
    },
  },
  {
    title: '更新时间',
    key: 'since2',
    dataIndex: 'createdAt',
    valueType: 'date',
    hideInSetting: true,
  },

  {
    title: '操作',
    key: 'option',
    width: 120,
    valueType: 'option',
    render: () => [<a key="1">操作</a>, <a key="2">删除</a>],
  },
];

export default () => {
  const [columnsStateMap, setColumnsStateMap] = useState<
    Record<string, ColumnsState>
  >({
    name: {
      show: false,
      order: 2,
    },
  });
  return (
    <><MainCard title="Sample Card">
      <Typography variant="body2">
        Lorem ipsum dolor sit amen, consenter nipissing eli, sed do elusion tempos incident ut laborers et doolie magna alissa. Ut enif ad
        minim venice, quin nostrum exercitation illampu laborings nisi ut liquid ex ea commons construal. Duos aube grue dolor in
        reprehended in voltage veil esse colum doolie eu fujian bulla parian. Exceptive sin ocean cuspidate non president, sunk in culpa qui
        officiate descent molls anim id est labours.
      </Typography>
    </MainCard><ProTable<TableListItem, { keyWord?: string; }>
        columns={columns}
        request={(params) => Promise.resolve({
          data: tableListDataSource.filter((item) => {
            if (!params?.keyWord) {
              return true;
            }
            if (item.name.includes(params?.keyWord) ||
              item.status.includes(params?.keyWord)) {
              return true;
            }
            return false;
          }),
          success: true,
        })}
        options={{
          search: true,
        }}
        rowKey="key"
        columnsState={{
          value: columnsStateMap,
          onChange: setColumnsStateMap,
        }}
        search={false}
        dateFormatter="string"
        headerTitle="受控模式" /></>
  );
};
