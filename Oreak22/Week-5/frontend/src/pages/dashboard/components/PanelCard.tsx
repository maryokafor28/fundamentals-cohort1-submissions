import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const PanelCard = ({
  title,
  children,
  action,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
}) => {
  return (
    <Card>
      <CardHeader className="flex items-start justify-between gap-4">
        <div>
          <CardTitle className="text-lg">{title}</CardTitle>
        </div>
        <div>{action}</div>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
export default PanelCard;
