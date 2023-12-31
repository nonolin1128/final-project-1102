import { useState, useEffect } from "react";
import ArticleCatogory from "@/components/article/article-catogory";
import { useRouter } from "next/router";
import Link from "next/link";
import Pagination from "@/components/pagination";

export default function ArticleList() {
  const [articlelist, setArticleList] = useState([]);
  const [activePage, setActivePage] = useState(1);
  const router = useRouter();

  //向伺服器要求資料，設定到狀態中
  const getArticleList = async () => {
    const res = await fetch("http://localhost:3005/api/article/");

    const data = await res.json();

    // console.log(data);
    // 設定到狀態中 -> 會觸發重新渲染(re-render)
    if (Array.isArray(data)) setArticleList(data);
  };

  // // didMount 初次渲染"後", 向伺服器要求資料，設定到狀態中
  useEffect(() => {
    if (router.isReady) {
      getArticleList();
    }
    // eslint-disable-next-line
  }, [router.isReady]);

  const itemsPerPage = 9;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // 根據當前路由決定 articlelist
  const type = articlelist;

  const currentData = type.slice(startIndex, endIndex);

  return (
    <>
      <div className="container mt-5">
        <div className="d-flex justify-content-center mb-5 mt-5">
          <ArticleCatogory />
        </div>

        <div>
          <>
            <div className="article-list-card">
              <div className="row row-cols-1 row-cols-md-3 g-4 mb-5">
                {currentData.map((v, i) => {
                  return (
                    <div className="col" key={`article-card-${v.article_id}`}>
                      <Link
                        href={`/article/${v.article_category_id}/${v.article_id}`}
                      >
                        <div className="card h-100">
                          <img src={v.img} alt="..." />
                          <div className="card-body">
                            <h5 className="card-title size-6 m-size-6">
                              {v.title}
                            </h5>
                            <p className="card-text size-7 m-size-7">
                              {v.published_date}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
            <Pagination
              itemsPerPage={itemsPerPage}
              total={type}
              activePage={activePage}
              setActivePage={setActivePage}
            />
          </>
        </div>
      </div>
    </>
  );
}
