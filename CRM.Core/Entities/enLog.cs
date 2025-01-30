using System;

namespace GS1Peru.Core.Entities
{
    public class enLog
    {
        private DateTime _CurrentDate;
        public DateTime CurrentDate
        {
            get
            {
                return _CurrentDate == null ? DateTime.Now : _CurrentDate;
            }

            set { _CurrentDate = value; }
        }
        public string Message { get; set; }
    }
}