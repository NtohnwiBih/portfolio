import { ProjectForm } from "@/components/admin/ProjectForm";

export default function NewProject() {
  return (
    <div className="mx-auto max-w-4xl">
      <p className="font-heading text-sm font-medium uppercase tracking-widest text-accent">Projects</p>
      <h1 className="mb-8 mt-2 font-heading text-3xl font-bold text-foreground">New project</h1>
      <ProjectForm />
    </div>
  );
}