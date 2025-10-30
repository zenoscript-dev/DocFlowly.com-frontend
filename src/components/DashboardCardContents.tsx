import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/core/lib/cn";
import { Check, CircleDashed, CircleX } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { ScrollArea } from "./ui/scroll-area";
import { Separator } from "./ui/separator";

type CardContentProps = {
    title: string;
    value: number | string;
    icon?: React.ReactNode;
}[]

type holidayProps = {
    title: string,
    month: string,
    date: string,
}[]

type ReportsContentProps = {
    id: number;
    code: string;
    name: string;
    filename: string;
    path: string;
    criteria: string;
    status: string;
}[]

type LeaveContentProps = {
    id: number;
    date: string;
    description: string;
    optional: boolean;
}[]

const DashboardCardContents = ({ title, description, action, content, ReportsContent, footer, holidayContent, LeaveContent, DashboardCard, icon, timeStudyContents, todoContents, showFooter, staffLeaveRequestTotal,link }:
    { title?: string, description?: string, action?: string, content?: CardContentProps, DashboardCard?: boolean, footer?: string, holidayContent?: holidayProps, ReportsContent?: ReportsContentProps, LeaveContent?: LeaveContentProps, icon?: React.ReactNode, timeStudyContents?: any, todoContents?: any, showFooter?: boolean, staffLeaveRequestTotal?: boolean ,link?:string}) => {

    function isToday(date: Date) {
        const today = new Date();
        return (
            date.getFullYear() === today.getFullYear() &&
            date.getMonth() === today.getMonth() &&
            date.getDate() === today.getDate()
        );
    }
    return (
        <Card className="h-full">
            <CardHeader>
                <Link to={link || ""}><CardTitle className="text-underline hover:underline hover:underline-offset-[5px]">{title}</CardTitle></Link>
                {description && <CardDescription>{description}</CardDescription>}
                {action || icon && <CardAction className="text-custom-color">{action || icon}</CardAction>}
            </CardHeader>
            <CardContent>
                <>
                    {DashboardCard && content && content.map((item: any) => (
                        <div key={item.title} className="flex items-center gap-2">
                            <p className={cn(staffLeaveRequestTotal ? "mb-2" : "", "flex justify-between gap-2 w-full")}><span>{item.title}</span><span className="text-custom-color">{item.value}</span></p>
                        </div>
                    ))}
                    {staffLeaveRequestTotal &&
                        <>
                            <Separator className="h-8 my-4" />
                            <p className="flex justify-between gap-2 w-full">Total <span className="text-custom-color"></span>{content && content.reduce((acc: number, item: any) => acc + Number(item.value), 0)}</p>
                        </>
                    }
                </>

                {ReportsContent && (
                    <ScrollArea className="h-60 w-full rounded-md border">
                        <div className="p-4">
                            {ReportsContent.map((item: any, index: number) => (
                                <div key={item.id}>
                                    <p className="flex justify-between gap-2 text-sm">
                                        <span>{item.name}</span>
                                        <span className="text-custom-color">{item.code}</span>
                                    </p>
                                    {index < ReportsContent.length - 1 && (
                                        <Separator className="h-8" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
                {LeaveContent &&
                    <ScrollArea className="h-60 w-full sm:w-100 2xl:w-58 rounded-md border">
                        <div className="p-4">
                            {LeaveContent?.map((item: any, index: number) => (
                                <div key={item.id}>
                                    <div className="text-sm mb-1 flex justify-between gap-2"><p>{item.description}</p><p className="text-custom-color align-left">{item.date}</p></div>
                                    {index < LeaveContent.length - 1 && (
                                        <Separator className="h-8" />
                                    )}
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                }
                {timeStudyContents && (
                    <>
                        <Separator className="my-2" />
                        <div className="flex flex-row justify-between items-center gap-2">
                            {timeStudyContents.map((item: any, index: number) => (<>
                                <div className="flex flex-col justify-between items-center gap-2 text-sm">
                                    <p >{item.title} </p>
                                    <p className="text-custom-color text-lg font-bold"> {item.value}</p>
                                </div>
                            </>
                            ))}
                        </div>
                    </>
                )}
                {
                    todoContents && (
                        <>
                            <ScrollArea className="h-40 w-full sm:w-100 2xl:w-full rounded-md border">
                                <div className="p-4">
                                    {todoContents.map((item: any, index: number) => (
                                        <div key={item.title}>
                                            <p className="text-sm mb-1 flex justify-between gap-2">
                                                <p className="w-[60%]">{item.title}</p>
                                                <p className="text-custom-color align-left w-[35%]">{item.date}</p>
                                                <p className="w-[5%]">
                                                    {new Date(item.date).getMonth() !== new Date().getMonth() && <CircleX style={{ color: "#FF0000" }} />}
                                                    {item.status === 'inprogress' && new Date(item.date).getMonth() === new Date().getMonth() && <CircleDashed style={{ color: "#FFD700" }} />}
                                                    {item.status === 'completed' && <Check style={{ color: "#00FF00" }} />}
                                                </p>
                                            </p>
                                            {index < todoContents.length - 1 && (
                                                <Separator className="h-8" />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </>
                    )
                }
            </CardContent>
            <CardFooter className={cn(showFooter ? "block" : "hidden")}>
                {holidayContent && holidayContent.map((item: any) => (
                    <div key={item.title}>
                        <p className="flex space-between  gap-2"><span className="text-custom-color">{item.title} :</span> <span> {item.month} {item.date}</span></p>
                    </div>
                ))}
                <Button variant="link" className="text-sm">{footer}</Button>
            </CardFooter>
        </Card>
    )
}
export default DashboardCardContents;