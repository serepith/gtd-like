import Link from 'next/link'
import TaskList from '@/components/ui/task-list'
  
  export default async function Tasks() {

    return (
      <div>
        <h1>Tasks Page</h1>

        <TaskList />

        <Link href="/">Back to Home</Link>
      </div>
    )
  }

  