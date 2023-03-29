import NewsPublish from "../../../components/publish-manage/NewsPublish"
import usePublish from "../../../components/publish-manage/usePublish"
import { Button } from "antd"
export default function Sunset() {
  // 已下线 3
  const { dataSource, handlerDelete } = usePublish(3)

  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        Button={(item) => (
          <Button
            type="primary"
            danger
            size="large"
            onClick={() => handlerDelete(item)}
          >
            删除
          </Button>
        )}
      ></NewsPublish>
    </div>
  )
}
