// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";

error TypeARealCourse(string course);

contract Grades is Ownable {

    struct Student {
        string name;
        uint256 gradeBiology;
        uint256 gradeMaths;
        uint256 gradeFr;
    }

    mapping(address => bool) teachers;
    Student[] students;

    uint16 public factor = 1000;

    constructor() Ownable(msg.sender) { }

    modifier isTeacher() {
        require(teachers[msg.sender], "Not a teacher");
        _;
    }

    function addTeacher(address _teacherAddress) external onlyOwner {
        teachers[_teacherAddress] = true;
    }

    function addStudent(string memory _name) external isTeacher {
        Student memory s = Student(_name, 0, 0, 0);
        students.push(s );
    }

    function isEqual(string memory _string1, string memory _string2) 
    private pure returns(bool) {
        return keccak256(abi.encodePacked(_string1)) == keccak256(abi.encodePacked(_string2));
    }

    function getStudentFromName(string memory _name) private view returns(uint256) {
        for(uint256 i = 0 ; i < students.length ; i++) {
            if(isEqual(students[i].name, _name)) {
                return i;
            }
        }
        revert();
    }

    function setNote(string memory _name, string memory _course, uint256 _note) external isTeacher {
        uint256 idStudent = getStudentFromName(_name);
        if(isEqual(_course, "biology")) {
            students[idStudent].gradeBiology = _note;
        }
        else if(isEqual(_course, "maths")) {
            students[idStudent].gradeMaths = _note;
        }
        else if(isEqual(_course, "french")) {
            students[idStudent].gradeFr = _note;
        }
        else {
            revert TypeARealCourse(_course);
        }
    }

    function getNote(string memory _name, string memory _course) external view returns(uint256) {
        uint256 idStudent = getStudentFromName(_name);
        if(isEqual(_course, "biology")) {
            return students[idStudent].gradeBiology;
        }
        else if(isEqual(_course, "maths")) {
            return students[idStudent].gradeMaths;
        }
        else if(isEqual(_course, "french")) {
            return students[idStudent].gradeFr;
        }
        else {
            revert TypeARealCourse(_course);
        }
    }

    function averageStudent(string memory _name) public view returns(uint256) {
        uint idStudent = getStudentFromName(_name);
        return ((students[idStudent].gradeBiology + students[idStudent].gradeMaths + students[idStudent].gradeFr) * factor) / 3;
    }

    function isPassing(string memory _name) external view returns(bool) {
        return averageStudent(_name) >= 10 * factor;
    }
    
    function averageClassForCourse(string memory _course) external view returns(uint256) {
        uint256 sum;
        for(uint256 i = 0 ; i < students.length ; i++) {
            if(isEqual(_course, "biology")) {
                sum += students[i].gradeBiology;
            }
            else if(isEqual(_course, "maths")) {
                sum += students[i].gradeMaths;
            }
            else if(isEqual(_course, "french")) {
                sum += students[i].gradeFr;
            }
        }
        return (sum * factor) / students.length;
    }

    function averageClass() external view returns(uint256) {
        uint256 totalGrades;
        uint256 totalStudents;

        for(uint256 i = 0 ; i < students.length ; i++) {
            totalGrades += students[i].gradeBiology + students[i].gradeMaths + students[i].gradeFr;
            totalStudents += 3;
        }
        return (totalGrades * factor) / totalStudents;
    }

}