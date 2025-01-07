import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"

const ArticleTitle: QuartzComponent = ({ fileData, displayClass }: QuartzComponentProps) => {
  const title = fileData.frontmatter?.title

  console.log(fileData.frontmatter?.articleImage)

  let img = null;
  if (fileData.slug === "index") {
    return <>
      <img src="images/greg.png" style="height: 140px; margin-top: 16px; margin-bottom: 0;"></img>
      <h1 class={classNames(displayClass, "article-title")} style="margin-top: 8px;">{title}</h1>
    </>
  }

  if (title) {
    return <h1 class={classNames(displayClass, "article-title")}>{title}</h1>;
  } else {
    return null
  }
}

ArticleTitle.css = `
.article-title {
  margin: 2rem 0 0 0;
}
`

export default (() => ArticleTitle) satisfies QuartzComponentConstructor
