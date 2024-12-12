// app/types/Recipe.ts

import { Entry, EntrySkeletonType, Asset } from "contentful";
import { Document } from "@contentful/rich-text-types"; // Contentful Rich Text 타입

/** 공통 타입 정의 **/

// 위치 정보 타입
export interface Location {
  lat: number; // 위도
  lon: number; // 경도
}

/** Ingredient 타입 정의 **/

// Ingredient Content Type의 필드 정의
export interface IngredientFields {
  name: string; // 이름 (Short text, 필수)
  slug: string; // 슬러그 (Short text, 필수)
  germanMeatCut?: string; // 독일식 고기 부위 (Short text, 선택)
  bild?: Asset; // 이미지 (Media - Image, 선택)
  description?: Document; // 설명 (Rich Text, 선택)
}

// Ingredient Content Type의 스켈레톤 정의
export interface IngredientSkeleton
  extends EntrySkeletonType<IngredientFields> {
  fields: IngredientFields;
  contentTypeId: "ingredient";
}

// Ingredient Entry 타입 정의
export type Ingredient = Entry<IngredientSkeleton>;

/** RecipeIngredient 타입 정의 **/

// RecipeIngredient Content Type의 필드 정의
export interface RecipeIngredientFields {
  title?: string; // 제목 (Short text, 선택)
  ingredient: Ingredient; // 재료 (Reference - Ingredient, 필수)
  quantity: string; // 재료 양 (Short text, 필수)
}

// RecipeIngredient Content Type의 스켈레톤 정의
export interface RecipeIngredientSkeleton
  extends EntrySkeletonType<RecipeIngredientFields> {
  fields: RecipeIngredientFields;
  contentTypeId: "recipeIngredient";
}

// RecipeIngredient Entry 타입 정의
export type RecipeIngredient = Entry<RecipeIngredientSkeleton>;

/** Recipe 타입 정의 **/

// Recipe Content Type의 필드 정의
export interface RecipeFields {
  titel: string; // 제목 (Short text, 필수)
  slug: string; // 슬러그 (Short text, 필수)
  description: Document; // 설명 (Rich Text, 필수)
  image: Asset[]; // 이미지 목록 (Media - Image, 필수)
  category: string; // 카테고리 (Short text, 필수)
  preparationTime: number; // 준비 시간 (Integer, 필수)
  servings: number; // 인분 (Integer, 필수)
  ingredients: RecipeIngredient[]; // 재료 목록 (Reference - RecipeIngredient, 필수)
  instructions: Document; // 조리 방법 (Rich Text, 필수)
  videoFile?: Asset; // 비디오 파일 (Media - Video, 선택)
  youTubeUrl?: string; // YouTube URL (Short text, 선택)
}

// Recipe Content Type의 스켈레톤 정의
export interface RecipeSkeleton extends EntrySkeletonType<RecipeFields> {
  fields: RecipeFields;
  contentTypeId: "recipe";
}

// Recipe Entry 타입 정의
export type Recipe = Entry<RecipeSkeleton>;

/** Gallery 타입 정의 **/

// Gallery Content Type의 필드 정의
export interface GalleryFields {
  titel: string; // 제목 (Short text, 필수)
  bild: Asset[]; // 이미지 목록 (Media - Image, 필수)
  location: Location; // 위치 정보 (Location, 필수)
  businessName: string; // 상호명 (Short text, 필수)
}

// Gallery Content Type의 스켈레톤 정의
export interface GallerySkeleton extends EntrySkeletonType<GalleryFields> {
  fields: GalleryFields;
  contentTypeId: "gallery";
}

// Gallery Entry 타입 정의
export type Gallery = Entry<GallerySkeleton>;
