import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import { DepartmentService } from './department.service';
import { Department } from './department';

describe('DepartmentService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let service: DepartmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [HttpClientTestingModule],
    providers: [DepartmentService]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(DepartmentService);
  });

  afterEach(() => httpTestingController.verify());

  it('should be created', () => {
    service = TestBed.get(DepartmentService);
    expect(service).toBeTruthy();
  });

  describe('#getAll', () => {
    const expectedDept: Department[] = [
      { deptId: 'csc', name: 'Computer Science', headOfDepartment: 'ASGGDSHDSGS' },
      { deptId: 'mth', name: 'Mathematics', headOfDepartment: 'ASGGDSHDSGS' }
    ];

    it('Should return all expected courses (called once)', () => {
      service.getAll().subscribe((courses) => {
        expect(courses).toEqual(expectedDept, 'Should return expected courses');
        expect(courses.length).toEqual(2);
      }, fail);

      const req = httpTestingController.expectOne(service.deptUrl); // make one request
      expect(req.request.method).toEqual('GET');

      req.flush(expectedDept); // respond  with expected courses
    });

    it('Should be ok return no course', () => {
      service.getAll().subscribe(
        courses => expect(courses.length).toEqual(0, 'should be ok return empty array'),
        fail
      );
      const req = httpTestingController.expectOne(service.deptUrl);
      req.flush([]); // respond with empty courses
    });

    it('should return courses (called many times)', () => {
      service.getAll().subscribe();
      service.getAll().subscribe();
      service.getAll().subscribe(
        courses => expect(courses).toEqual(expectedDept, 'should return expected courses'),
        fail
      );

      const req = httpTestingController.match(service.deptUrl);
      expect(req.length).toEqual(3, 'calls made to getAll()');

      // respond to requests
      req[0].flush([]);
      req[1].flush([{  }]);
      req[2].flush(expectedDept);
    });
  });

  describe('#createOne', () => {
    const department: Department[] = [
      { deptId: 3, headOfDepartment: '', name: 'Science' }
    ];

    it('should create a Department with valid inputs', () => {
      const newDepartment: Department = { deptId: 3, headOfDepartment: '', name: 'Science' };
      service.createOne(newDepartment).subscribe((resp) => {
        department.push(resp);
        expect(department.length).toEqual(2);
        expect(newDepartment).toEqual(resp);
        }, fail);

      const req = httpTestingController.expectOne(service.deptUrl);
      expect(req.request.method).toEqual('POST');
      req.flush(department);
    });
  });

  describe('#deleteOne', () => {
    const department: Department[] = [
      { deptId: 3, headOfDepartment: '', name: 'Science' }
    ];
    it('should delete a Department by a given Id', () => {
      service.deleteOne('csc302').subscribe((resp) => {
        expect(resp).toEqual(department[0]);
        expect(department.pop()).toEqual(resp, 'should match the Department deleted');
        expect(department.length).toEqual(0, 'Should delete Department given by an id');
      }, fail);

      const req = httpTestingController.expectOne(`${service.deptUrl}/3`);
      expect(req.request.method).toEqual('DELETE');
      req.flush(department);
    });
  });

  describe('#updateOne', () => {
    const department: Department[] = [
      { deptId: 3, headOfDepartment: '', name: 'Science' }
    ];
    it('should update a Department given by an id', () => {
      const updatedDepartment: Department = {
        deptId: 'csc302', headOfDepartment: 'Mel Gibson', name: 'Applied Science'
      };
      service.updateOne('csc302', updatedDepartment).subscribe((resp) => {
        expect(updatedDepartment).toEqual(resp);
      }, fail);

      const req = httpTestingController.expectOne(service.deptUrl);
      expect(req.request.method).toEqual('PUT');
      req.flush(department);
    });
  });
});
