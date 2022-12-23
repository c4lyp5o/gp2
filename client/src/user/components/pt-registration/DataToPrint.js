import React from 'react';

class ComponentToPrint extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
    };
  }
  render() {
    const { data } = this.state;
    return (
      <div className='sticker'>
        <div className='header'>
          <h1>Patient Sticker</h1>
        </div>
        <div className='body'>
          <table>
            <tr>
              <td>Patient Name:</td>
              <td>{data.nama}</td>
            </tr>
            <tr>
              <td>Patient ID:</td>
              <td>{data.ic}</td>
            </tr>
            <tr>
              <td>Date of Birth:</td>
              <td>{data.tarikhLahir}</td>
            </tr>
            <tr>
              <td>Phone Number:</td>
              <td>{data.jantina}</td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
}

export default ComponentToPrint;
