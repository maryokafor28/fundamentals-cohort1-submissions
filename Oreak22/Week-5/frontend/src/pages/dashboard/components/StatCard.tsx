import { Card, CardContent } from "@/components/ui/card";

const StatCard = ({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
}) => {
  return (
    <Card className="shadow-md">
      <CardContent className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="text-2xl font-medium">{value}</p>
        </div>
        <div className="h-12 w-12 rounded-lg bg-muted/50 flex items-center justify-center">
          {icon}
        </div>
      </CardContent>
    </Card>
  );
};
export default StatCard;
