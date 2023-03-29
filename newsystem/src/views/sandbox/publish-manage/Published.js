import NewsPublish from "../../../components/publish-manage/NewsPublish"
import usePublish from "../../../components/publish-manage/usePublish"
import { Button } from "antd"
export default function Published() {
  // 已发布 2
  const { dataSource, handlerSunset } = usePublish(2)

  return (
    <div>
      <NewsPublish
        dataSource={dataSource}
        Button={(item) => (
          <Button
            type="dashed"
            danger
            size="large"
            onClick={() => handlerSunset(item)}
          >
            下线
          </Button>
        )}
      ></NewsPublish>
    </div>
  )
}
