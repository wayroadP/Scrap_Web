import { Suspense } from 'react'
async function getBlogs(){
    const response = await fetch('https://66161da3b8b8e32ffc7c676b.mockapi.io/blogs')
    if(!response.ok){
        throw new Error('cannot fetch blog')
    }
    return response.json()
}
export default async function Page(){
    const blogs=await getBlogs()
    console.log('blogs',blogs)
    return(
        <div>
            Content page
            <Suspense fallback={<p>Loading feed...</p>}>
            {
                blogs.map((blog,index)=>(
                    <div key={index}>
                        {blog.id} {blog.name}
                    </div>
                ))
            }
            </Suspense>
        </div>
    )
}