import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Employee } from '../models/employee.model';
import { firstValueFrom } from 'rxjs';
import { GetAllEmployeesResponse } from '../responses/getAllEmployees.response';
import { environment } from '../../environments/environment';
import { DeleteEmployeeResponse } from '../responses/deleteEmployee.response';
import { EmployeeType } from '../models/employeeType.model';
import { GetEmployeeTypesResponse } from '../responses/getEmployeeTypes.response';
import { GetEmployeeResponse } from '../responses/getEmployee.response';
import { GetEmployeesOrderedByLessAssignedOrdersResponse } from '../responses/getEmployeesOrderedByLessAssignedOrders.response';
import { EmployeesOrderBy } from '../models/employeesOrderBy';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  httpClient = inject(HttpClient)

  constructor() {}

  public async getAllEmployees(): Promise<Employee[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetAllEmployeesResponse>(
        `${environment.apiBaseUrl}employees`,
        { observe: 'response', withCredentials: true }
      )
    );

    if (response.ok) {
      return response!.body!.employees;
    }

    return [];
  }

  public async getEmployeesOrderedByLessAssignedOrders(): Promise<Employee[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetEmployeesOrderedByLessAssignedOrdersResponse>(
        `${environment.apiBaseUrl}employees?orderBy=${EmployeesOrderBy.LESS_ASSIGNED}`,
        { observe: 'response', withCredentials: true }
      )
    );

    if (response.ok) {
      return response!.body!.employees;
    }

    return [];
  }

  public async deleteEmployee(
    user_id: number
  ): Promise<HttpResponse<DeleteEmployeeResponse>> {
    const response = await firstValueFrom(
      this.httpClient.delete<DeleteEmployeeResponse>(
        `${environment.apiBaseUrl}employee/${user_id}`,
        { observe: 'response', withCredentials: true }
      )
    );

    return response;
  }

  public async getEmployeeTypes(): Promise<EmployeeType[]> {
    const response = await firstValueFrom(
      this.httpClient.get<GetEmployeeTypesResponse>(
        `${environment.apiBaseUrl}employee/types`,
        { observe: 'response', withCredentials: true }
      )
    );

    if (response.ok) return response.body!.employeeTypes;

    return [];
  }

  public async createEmployee(
    fullName: string,
    dni: string,
    email: string,
    phone: string,
    password: string,
    admin: boolean,
    employeeType: string
  ): Promise<HttpResponse<Object>> {
    const response = await firstValueFrom(
      this.httpClient.post(
        `${environment.apiBaseUrl}employee`,
        {
          fullName,
          dni,
          email,
          phone,
          password,
          admin,
          employeeType,
        },
        { observe: 'response', withCredentials: true }
      )
    )

    return response
  }

  public async updateEmployee(
    id: number,
    userId: number,
    fullName: string,
    dni: string,
    email: string,
    phone: string,
    password: string,
    updatePassword: boolean,
    admin: boolean | undefined,
    employeeType: string | undefined
  ): Promise<HttpResponse<any>> {
    const response = await firstValueFrom(
      this.httpClient.put<any>(
        `${environment.apiBaseUrl}employee/${id}`,
        {
          userId,
          fullName,
          dni,
          email,
          phone,
          password,
          updatePassword,
          admin,
          employeeType,
        },
        { observe: 'response', withCredentials: true }
      )
    )

    return response
  }

  public async getEmployee(employeeId: string | null): Promise<Employee | null> {
    const response = await firstValueFrom(
      this.httpClient.get<GetEmployeeResponse>(
        `${environment.apiBaseUrl}employee/${employeeId}`,
        { observe: 'response', withCredentials: true }
      )
    )

    if(response.ok) return response.body!.employee

    return null
  }

  public async assignEmployeeToOrder(orderId: number, employeeId: number): Promise<HttpResponse<any>> {
    const response = await firstValueFrom(
      this.httpClient.post<any>(
        `${environment.apiBaseUrl}employee/assign`,
        { orderId, employeeId },
        { observe: 'response', withCredentials: true }
      )
    )

    return response
  }
}
