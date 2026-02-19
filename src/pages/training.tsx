import GlobalLayout from '@/components/GlobalLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle2, TrendingUp, Dumbbell } from 'lucide-react';

export default function TrainingPage() {
  const trainingPlan = [
    { day: '周一', task: '节奏行走练习', duration: '15分钟', status: 'completed' },
    { day: '周二', task: '上肢协调训练', duration: '20分钟', status: 'pending' },
    { day: '周三', task: '呼吸与发声', duration: '10分钟', status: 'pending' },
    { day: '周四', task: '休息日', duration: '-', status: 'rest' },
    { day: '周五', task: '综合节奏训练', duration: '25分钟', status: 'pending' },
  ];

  return (
    <GlobalLayout>
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">训练计划</h1>
            <p className="text-muted-foreground">坚持每日练习，见证康复奇迹</p>
          </div>
          <Button>
            <Dumbbell className="mr-2 h-4 w-4" />
            开始今日训练
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">总训练时长</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12.5 小时</div>
              <p className="text-xs text-muted-foreground">+2.5% 较上周</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">连续打卡</CardTitle>
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5 天</div>
              <p className="text-xs text-muted-foreground">保持这一势头！</p>
            </CardContent>
          </Card>
        </div>

        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>本周任务</CardTitle>
            <CardDescription>
              您的个性化康复日程表
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {trainingPlan.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={`
                      h-10 w-10 rounded-full flex items-center justify-center font-bold
                      ${item.status === 'completed' ? 'bg-green-100 text-green-600' : 
                        item.status === 'rest' ? 'bg-slate-100 text-slate-500' : 'bg-primary/10 text-primary'}
                    `}>
                      {item.day.slice(1)}
                    </div>
                    <div>
                      <h4 className="font-semibold">{item.task}</h4>
                      <p className="text-sm text-muted-foreground">{item.duration}</p>
                    </div>
                  </div>
                  <div>
                    {item.status === 'completed' ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : item.status === 'rest' ? (
                      <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded-full">休息</span>
                    ) : (
                      <Button variant="outline" size="sm">开始</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </GlobalLayout>
  );
}
