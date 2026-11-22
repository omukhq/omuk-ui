import { Tabs, TabsContent, TabsList, TabsTrigger } from '@omuk/ui/tabs';

export default function TabsLine() {
  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList variant="line" aria-label="Project">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="deployments">Deployments</TabsTrigger>
        <TabsTrigger value="settings">Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="overview" className="py-4 text-muted">
        The billing service runs in two regions. The last deploy was two hours
        ago.
      </TabsContent>
      <TabsContent value="deployments" className="py-4 text-muted">
        38 deployments this month. None failed.
      </TabsContent>
      <TabsContent value="settings" className="py-4 text-muted">
        Change the project’s name, its regions and who can deploy it.
      </TabsContent>
    </Tabs>
  );
}
