import { ProForm, ProFormGroup, ProFormText } from "@ant-design/pro-components"
import { Card } from "antd"

const Applycert = () => {
    return (
        <Card>
            <ProForm >
                <ProFormGroup>
                    <ProFormText width="md" name="name" label="name" />
                    <ProFormText width="md" name="name" label="name" />
                    <ProFormText width="md" name="name" label="name" />
                </ProFormGroup>
            </ProForm>
        </Card>
    )
}
export default Applycert