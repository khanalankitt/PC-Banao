import api from './axios';
import { IPart } from './productApi';

export interface IBuildComponents {
  cpu?: string;
  gpu?: string;
  motherboard?: string;
  ram?: string[];
  storage?: string[];
  psu?: string;
  case?: string;
  cooler?: string;
}

export interface IPopulatedComponents {
  cpu?: IPart;
  gpu?: IPart;
  motherboard?: IPart;
  ram?: IPart[];
  storage?: IPart[];
  psu?: IPart;
  case?: IPart;
  cooler?: IPart;
}

export interface IBuild {
  _id: string;
  name: string;
  user: { _id: string; name: string; image?: string };
  components: IPopulatedComponents;
  totalPrice: number;
  totalWattage: number;
  isPublic: boolean;
  isCompatible: boolean;
  compatibilityIssues: string[];
  createdAt: string;
}

export interface CreateBuildPayload {
  name: string;
  components: IBuildComponents;
  isPublic?: boolean;
}

export interface UpdateBuildPayload {
  name?: string;
  components?: IBuildComponents;
  isPublic?: boolean;
}

export async function createBuild(payload: CreateBuildPayload): Promise<IBuild> {
  const { data } = await api.post<{ data: IBuild }>('/api/builds', payload);
  return data.data;
}

export async function updateBuild(id: string, payload: UpdateBuildPayload): Promise<IBuild> {
  const { data } = await api.patch<{ data: IBuild }>(`/api/builds/${id}`, payload);
  return data.data;
}

export async function deleteBuild(id: string): Promise<void> {
  await api.delete(`/api/builds/${id}`);
}

export async function getMyBuilds(): Promise<IBuild[]> {
  const { data } = await api.get<{ data: IBuild[] }>('/api/builds/mine');
  return data.data;
}
