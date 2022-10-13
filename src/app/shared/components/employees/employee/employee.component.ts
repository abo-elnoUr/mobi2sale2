import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { EmployeeService } from 'src/app/core/services/employee.service';
import { ToastrService } from 'ngx-toastr';

import { Employee } from './../../../models/employee';
import { Department } from 'src/app/shared/models/department';

@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrls: ['./employee.component.css']
})
export class EmployeeComponent implements OnInit {

  employees: Employee[] = []
  addEmployeeForm: FormGroup
  governorates: any[] = []
  districts: any[] = []
  departments: Department[] = []
  activeDistrict: boolean = true

  constructor(private _EmployeeService: EmployeeService, private _ToastrService: ToastrService) { }

  ngOnInit(): void {
    this.addEmployeeForm = new FormGroup({
      departmentId: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      dateOfBrith: new FormControl('', Validators.required),
      mobile1: new FormControl('', Validators.required),
      mobile2: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      image: new FormControl('', Validators.required),
      visaNumber: new FormControl('', Validators.required),
      visaImage: new FormControl('', Validators.required),
      districtID: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    });

    // call functions
    this.getEmployees()
    this.getGovernorate()
    this.getDepartments()
  }

  // get all employees
  getEmployees() {
    this._EmployeeService.getEmployees().subscribe((employees) => {
      this.employees = employees
    })
  }

  // get all governate
  getGovernorate() {
    this._EmployeeService.getGovernorate().subscribe((governates) => {
      this.governorates = governates
    })
  }

  // get all departments
  getDepartments() {
    this._EmployeeService.getDepartments().subscribe((departments) => {
      this.departments = departments
    })
  }

  // get all districts
  getDistricts(id: string) {
    this._EmployeeService.getAllDistrict(id).subscribe((districts) => {
      this.districts = districts
    })
  }

  // add employee
  onPickImageVisa(event: any) {
    const img = event.target.files[0]
    this.addEmployeeForm.get('visaImage').setValue(img)
  }

  onPickImageEmp(event: any) {
    const img = event.target.files[0]
    this.addEmployeeForm.get('image').setValue(img)
  }

  onAddSelectGov(event: any) {
    const govId = event.target.value
    this.getDistricts(govId)
    this.activeDistrict = false
  }

  onAddSelectDepartId(event: any) {
    const departId = event.target.value
    this.addEmployeeForm.get('departmentId').setValue(departId)
  }

  onAddSelectDistrict(event: any) {
    const district = event.target.value
    this.addEmployeeForm.get('districtID').setValue(district)
  }

  addEmployee() {
    const employeeForm = new FormData()
    employeeForm.append('departmentId', this.addEmployeeForm.get('departmentId').getRawValue())
    employeeForm.append('firstName', this.addEmployeeForm.get('firstName').getRawValue())
    employeeForm.append('lastName', this.addEmployeeForm.get('lastName').getRawValue())
    employeeForm.append('dateOfBrith', this.addEmployeeForm.get('dateOfBrith').getRawValue())
    employeeForm.append('mobile1', this.addEmployeeForm.get('mobile1').getRawValue())
    employeeForm.append('mobile2', this.addEmployeeForm.get('mobile2').getRawValue())
    employeeForm.append('phone', this.addEmployeeForm.get('phone').getRawValue())
    employeeForm.append('email', this.addEmployeeForm.get('email').getRawValue())
    employeeForm.append('image', this.addEmployeeForm.get('image').getRawValue())
    employeeForm.append('visaNumber', this.addEmployeeForm.get('visaNumber').getRawValue())
    employeeForm.append('visaImage', this.addEmployeeForm.get('visaImage').getRawValue())
    employeeForm.append('districtID', this.addEmployeeForm.get('districtID').getRawValue())
    employeeForm.append('street', this.addEmployeeForm.get('street').getRawValue())
    employeeForm.append('password', this.addEmployeeForm.get('password').getRawValue())

    this._EmployeeService.addEmployee(employeeForm).subscribe((addEmp) => {
      this._ToastrService.success('employee add 👍')
      this.addEmployeeForm.reset()
      this.getEmployees()
    },
      (error) => {
        switch (error.status) {
          case 500:
            this._ToastrService.error(error.error.errors as string);
            break
          case 400:
            for (const [key, value] of Object.entries(error.error.errors)) {
              this._ToastrService.error(value as string);
            }
            break
        }
      },
      () => { })
  }

}
