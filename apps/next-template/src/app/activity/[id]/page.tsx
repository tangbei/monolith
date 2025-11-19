import { Metadata } from 'next'
import { request3 } from '@/common/apis/modules';

interface Props {
  params: Promise<{
    id: string
  }>
}

// 动态生成元数据
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `My Store ${id}`,
    description: `Details for product ${id}`,
  }
}

const ActivityPage = async({ params }: Props) => {
  const { id } = await params;
  console.log('id', id);

  async function getJson({ params }: Props): Promise<Metadata> {
    const { id } = await params;
  
    const res = await request3<{ title: string, desc: string }>({ id });
    
    return {
      title: `Product ${res.data.title} - My Store`,
      description: `Details for product ${res.data.desc}`,
    }
  }
  
  const metadata = await getJson({ params });

  console.log('metadata', metadata);

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">{metadata.title?.toString()}</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">Product ID: {id}</h2>
            <p className="text-gray-600">
              This is a dynamic product page. You can fetch real product data here based on the ID.
            </p>
          </div>

          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-2">Product Information</h3>
            <ul className="space-y-2">
              <li className="flex justify-between">
                <span className="text-gray-600">ID:</span>
                <span className="font-medium">{id}</span>
              </li>
              <li className="flex justify-between">
                <span className="text-gray-600">Status:</span>
                <span className="font-medium">Available</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  )
};

export default ActivityPage;