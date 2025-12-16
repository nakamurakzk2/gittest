// Components
import ErrorPage from "@/components/common/ErrorPage"
import SimpleProductView from "@/components/product/SimpleProductView"

// Logic
import * as ProductPublicServerLogic from "@/logic/server/product/product-public-server-logic"

// Constants
import { getBackgroundClass } from "@/define/colors"

type Props = {
  params: { productGroupId: string }
  searchParams: { productId?: string }
}

export default async function ProductGroupPage({ params, searchParams }: Props) {
  try {
    const { simpleProductGroup, simpleProductItems, simpleProductCategories, simpleBusiness, simpleTown } = await ProductPublicServerLogic.fetchSimpleProduct(params.productGroupId)

    return (
      <main className={`w-full px-2 py-6 ${getBackgroundClass('PRIMARY')} min-h-screen`}>
        <div className="max-w-6xl mx-auto">
          <SimpleProductView
            productGroup={simpleProductGroup}
            productItems={simpleProductItems}
            productCategories={simpleProductCategories}
            business={simpleBusiness}
            town={simpleTown}
            defaultProductId={searchParams.productId}
          />
        </div>
      </main>
    )
  } catch (error) {
    console.error(error)
    return <ErrorPage />
  }
}