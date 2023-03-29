import React, { useContext, useEffect, useRef, useState } from "react"
import axios from "axios"
// antd
import { Button, Form, Input, Table, notification } from "antd"
const EditableContext = React.createContext(null)
const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}
const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const inputRef = useRef(null)
  const form = useContext(EditableContext)
  useEffect(() => {
    if (editing) {
      inputRef.current.focus()
    }
  }, [editing])
  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({
      [dataIndex]: record[dataIndex]
    })
  }
  const save = async () => {
    try {
      const values = await form.validateFields()
      toggleEdit()
      handleSave({
        ...record,
        ...values
      })
    } catch (errInfo) {
      console.log("Save failed:", errInfo)
    }
  }
  let childNode = children
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`
          }
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }
  return <td {...restProps}>{childNode}</td>
}
export default function NewsCategory() {
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios.get(`/api/sys/categorieList`).then((res) => {
      let list = res.data.data
      setdataSource(list)
    })
  }, [])

  // 更新
  const handleSave = (record) => {
    let updateObj = {
      title: record.title,
      value: record.title
    }
    axios
      .post("/api/sys/updateCategorieList", { id: record._id, updateObj })
      .then((res) => {
        setdataSource(
          dataSource.map((v) => {
            if (record._id === v._id) {
              v.title = record.title
              v.value = record.title
              return v
            }
            return v
          })
        )
        notification.open({
          message: `栏目名称【${record.title}】修改成功`,
          description:
            "This is the content of the notification. This is the content of the notification. This is the content of the notification."
        })
      })
  }

  // 删除
  const handlerEdit = (item) => {
    // axios.post("/api/sys/delCategorieList", { id: item._id }).then((res) => {
    setdataSource(dataSource.filter((v) => v._id !== item._id))
    // })
  }

  // Table配置
  const columns = [
    {
      title: "ID",
      render: (item) => <b> {item._id}</b>
    },
    {
      title: "栏目名称",
      // eslint-disable-next-line jsx-a11y/anchor-is-valid
      render: (item) => <a> {item.title}</a>,
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: "title",
        title: "栏目名称",
        handleSave
      })
    },

    {
      title: "操作",
      align: "center",
      render: (item) => (
        <Button
          type="primary"
          danger
          shape="round"
          size="large"
          onClick={() => handlerEdit(item)}
        >
          删除
        </Button>
      )
    }
  ]
  return (
    <div>
      <Table
        columns={columns}
        dataSource={dataSource}
        rowKey={(item) => item._id}
        pagination={{
          showSizeChanger: true,
          pageSizeOptions: [5, 10, 20, 30],
          defaultPageSize: 10,
          total: dataSource.length,
          showTotal: (total, range) => `${range[0]}-${range[1]}  总${total}条`
        }}
        components={{
          body: {
            row: EditableRow,
            cell: EditableCell
          }
        }}
      />
    </div>
  )
}
