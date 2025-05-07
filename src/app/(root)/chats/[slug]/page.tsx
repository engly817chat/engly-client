
type Props = {
  params: { slug: string }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = params



  return (
    <div className="container">
      {slug}
    </div>
  )
}
