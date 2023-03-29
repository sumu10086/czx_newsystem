import NewsPublish from "../../../components/publish-manage/NewsPublish"
import usePublish from "../../../components/publish-manage/usePublish"
import { Button } from "antd"
export default function Unpublished() {
  // 待发布 1
  const { dataSource, handlerPublish } = usePublish(1)

  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        Button={(item) => (
          <Button
            type="primary"
            size="large"
            onClick={() => handlerPublish(item)}
          >
            发布
          </Button>
        )}
      ></NewsPublish>
    </div>
  )
}
