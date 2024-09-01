
import { useState } from "react"
import { Button, Card } from "antd"
import Drawer from './components/drawer'
const Page = () => {
    const [open, setOpen] = useState(false)
    const [drawerType, setDrawerType] = useState<'add' | 'edit'>('add')
    return (
        <Card>
            <Button type="primary" onClick={() => setOpen(!open)}>申请证书</Button>
            <Drawer options={{ open, setOpen, type: drawerType }} />

        </Card>
    )
}
export default Page