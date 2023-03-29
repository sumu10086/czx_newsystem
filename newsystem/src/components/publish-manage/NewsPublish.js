// antd
import { QqOutlined } from "@ant-design/icons"
import { Table } from "antd"

export default function NewsPublish(props) {
  // Table配置
  const columns = [
    {
      title: "新闻标题",
      key: "_id",
      align: "center",
      render: (item) => {
        return <a href={`#/news-manage/preview/${item._id}`}>{item.title}</a>
      }
    },
    {
      title: "作者",
      key: "author",
      dataIndex: "author",
      align: "center",
      render: (author, item) => {
        return (
          <div>
            <QqOutlined style={{ color: "orangered" }} />
            <a href={`#/news-manage/preview/${item._id}`}> {author}</a>
          </div>
        )
      }
    },
    {
      title: "新闻分类",
      key: "_id",
      dataIndex: "categorie",
      align: "center",
      render: (categorie) => categorie.title
    },
    {
      title: "操作",
      key: "_id",
      align: "center",
      render: (item) => <div>{props.Button(item)}</div>
    }
  ]

  return (
    <div>
      <Table
        columns={columns}
        dataSource={props.dataSource}
        rowKey={(item) => item._id}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 30],
          defaultPageSize: 10,
          total: props.dataSource.length,
          showTotal: (total, range) => `${range[0]}-${range[1]}  总${total}条`
        }}
      />
    </div>
  )
}
