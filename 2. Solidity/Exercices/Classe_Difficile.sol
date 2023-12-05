// SPDX-License-Identifier: MIT
pragma solidity 0.8.22;

import "@openzeppelin/contracts/access/Ownable.sol";

contract College is Ownable {

    struct Student {
        string name;
        string class;
        address addr;
        uint256 gradeBiology;
        uint256 gradeMaths;
        uint256 gradeFr;
    }

    Student[] private students;

    // class => course => address
    mapping (string => mapping (string => address)) teachers;

    event StudentAdded(string _name, string _class, address _addr);
    event TeacherAdded(string _class, string _course, address _addr);

    constructor() Ownable(msg.sender) { }

    function addStudent(string memory _name, string memory _class, address _addr) external onlyOwner {
        students.push(Student(_name, _class, _addr, 0,0,0));
        emit StudentAdded( _name, _class, _addr);
    }

    function setTeacher(string memory _class, string memory _course, address _addr) external onlyOwner {
        teachers[_class][_course] = _addr;
        emit TeacherAdded( _class, _course, _addr);
    }

    function getStudentFromName(string memory _name) private view returns(uint256){
        for(uint256 i = 0 ; i < students.length ; i++) {
            if(stringsEquals(students[i].name, _name)) {
                return i;
            }
        } 
        return 0;
    }

    function stringsEquals(string memory _string1, string memory _string2) 
    internal pure returns(bool) {
        return keccak256(abi.encodePacked(_string1)) == keccak256(abi.encodePacked(_string2));
    }

    function setNote(string memory _course, string memory _nameStudent, uint _grade) external {
        uint idStudent = getStudentFromName(_nameStudent);
        require(msg.sender == teachers[students[idStudent].class][_course], unicode"You're not the teacher of this student course.");
        if(stringsEquals(_course, "biology")) {
            students[idStudent].gradeBiology = _grade;
        }
        else if(stringsEquals(_course, "maths")) {
            students[idStudent].gradeMaths = _grade;
        }
        else if(stringsEquals(_course, "french")) {
            students[idStudent].gradeFr = _grade;
        }
        else {
            revert("Type a real course");
        }
    }

    function calculateAverageGradePerCourse(string memory _class, string memory _course) external view returns(uint256) {
        require(msg.sender == teachers[_class][_course], unicode"You're not the teacher of this class course.");
        uint totalGrade;
        uint totalStudent;
        for(uint256 i = 0; i < students.length ; i++) {
            if(stringsEquals(_class, students[i].class)) {
                if(stringsEquals(_course, "biology")){
                    totalGrade += students[i].gradeBiology;
                    totalStudent += 1;
                }
                if(stringsEquals(_course, "maths")){
                    totalGrade += students[i].gradeMaths;
                    totalStudent += 1;
                }
                if(stringsEquals(_course, "french")){
                    totalGrade += students[i].gradeFr;
                    totalStudent += 1;
                }
            }
        }
        uint256 average = totalGrade * 100 / totalStudent;
        return average;
    }

    function calculateAverageGradeStudent(string memory _name) public onlyOwner view returns(uint256) {
        uint idStudent = getStudentFromName(_name);
        return (students[idStudent].gradeBiology + students[idStudent].gradeMaths + students[idStudent].gradeFr) / 3;
    }

    function isPassing(string memory _name) external onlyOwner view returns(bool) {
        if(calculateAverageGradeStudent(_name) >= 10) {
            return true;
        }
        return false;
    }

    function calculateAverageGradeClass(string memory _class) external view onlyOwner returns(uint256) {
        uint totalGrade;
        uint totalStudent;
        for(uint256 i = 0 ; i < students.length ; i++) {
            if(stringsEquals(_class, students[i].class)) {
                totalGrade += students[i].gradeBiology + students[i].gradeMaths + students[i].gradeFr;
                totalStudent += 3;
            }
        }
        return totalGrade / totalStudent;
    }


}