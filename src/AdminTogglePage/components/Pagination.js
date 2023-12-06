/*
- 하나의 페이지당 총 20개의 유저 목록이 보여져야하며 이는 5개 단위의 페이지 네이션으로 보여져야 합니다. 마지막 페이지는 [10]입니다.
200 => 20개씩 => 10페이지
**ex)
<< < [1] [2] [3] [4] [5] > >>**

- 페이지 번호는 뒤로가기가 지원되어야하며 선택된 페이지에는 포커스가 이루져야합니다.
*/
import { useSearchParams } from "react-router-dom";

import { useEffect, useState } from "react";
import styled from "styled-components";

const Pagination = ({ totalLength, pagesPerGroup }) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const perPage = Number(searchParams.get("perPage")) || 20;
  const page = Number(searchParams.get("page")) || 1;

  //필요한 변수 지정
  //총 콘텐츠 개수 : totalContentsLength = 200
  //한 페이지 유저 개수 : contentPerPage = 20
  //총 페이지 개수 = 마지막 페이지 개수 : lastPage = 10
  //현재 페이지 : currentPage = 1 ~ 10

  // const contentPerPage = 20;
  const totalPage = totalLength / perPage;
  //:id => 파라미터 => 라우터에 설정이 필요
  //?page=12 => 쿼리스트링 => url에 포함x => 라우터 관련 없음
  //useSearchParams => 쿼리스트링 추출 {page : 12 }

  //현재 페이지 => 1 ~ 5 => 1그룹
  //            6 ~ 10 => 2그룹

  const [currentPage, setCurrentPage] = useState(page);

  //그룹
  //현재 페이지 그룹 : currentGroup
  //한 그룹당 보여줄 페이지 개수 : pagesPerGroup = 5
  //총 페이지 그룹 개수 : 총 페이지 개수 / 한 그룹당 보여줄 페이지 개수 = 2
  // const pagesPerGroup = 5;
  const [currentGroup, setCurrentGroup] = useState(1);

  const lastGroup = Math.ceil(totalPage / pagesPerGroup);

  //[1,2,3,4,5] => 1그룹
  //[6,7,8,9,10] => 2그룹

  //처음 페이지 이동 함수
  const onMoveStartPage = () => {
    setCurrentPage(1);
  };

  //마지막 페이지 이동 함수
  const onMoveLastPage = () => {
    setCurrentPage(totalPage);
  };

  //뒤로 가기 함수
  const onMoveNextPage = () => {
    if (currentPage !== totalPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  //앞으로 가기 함수
  const onMovePrevPage = () => {
    if (currentPage !== 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  //페이지 그룹을 바꿔주는 함수 => 현재 페이지가 바뀔 때마다 실행
  useEffect(() => {
    const newCurrentGroup = Math.ceil(currentPage / pagesPerGroup);
    setCurrentGroup(newCurrentGroup);
    searchParams.set("page", currentPage);
    setSearchParams(searchParams);
  }, [currentPage]);

  useEffect(() => {
    setCurrentPage(page);
  }, [page]);

  //해당 페이지로 이동하는 함수
  const onMoveTargetPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <S.Wrapper>
      <S.Button onClick={onMoveStartPage}>≪</S.Button>
      <S.Button onClick={onMovePrevPage}>＜</S.Button>
      {/*버튼들 현재 그룹 => 해당 버튼들만 보여주기*/}
      {Array(pagesPerGroup) //5
        .fill()
        .map((el, idx) => {
          const pageNumber = (currentGroup - 1) * pagesPerGroup + idx + 1;
          const isFocus = pageNumber === page;

          // data가 없으면 얼리 리턴으로 버튼 생성 X
          if (totalLength <= perPage * idx) return;

          return (
            <S.Button
              onClick={() => {
                onMoveTargetPage(pageNumber);
              }}
              isFocus={isFocus}
            >
              {pageNumber}
            </S.Button>
          );
        })}
      <S.Button onClick={onMoveNextPage}>＞</S.Button>
      <S.Button onClick={onMoveLastPage}>≫</S.Button>
    </S.Wrapper>
  );
};
export default Pagination;

const Wrapper = styled.div`
  width: 500px;
  height: 100px;
`;

const Button = styled.button`
  background-color: ${({ isFocus }) => (isFocus ? "red" : "white")};
`;

export const S = {
  Wrapper,
  Button,
};
